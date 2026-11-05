import { spawn } from "node:child_process";
import { createPreview } from "./preview.mjs";

// Reuse an explicit HTTPS origin for WebKit/live checks; otherwise serve the
// actual export on an ephemeral loopback port and clean up even after failure.
const server = process.env.PORTFOLIO_TEST_ORIGIN ? undefined : createPreview("out");
try {
  if (server) await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const origin = process.env.PORTFOLIO_TEST_ORIGIN ?? `http://127.0.0.1:${server.address().port}`;
  for (const script of ["public-content-browser-qa.mjs", "public-interactions-qa.mjs", "search-browser-qa.mjs", "contact-browser-qa.mjs"]) {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [`scripts/${script}`], {
        stdio: "inherit", env: { ...process.env, PORTFOLIO_TEST_ORIGIN: origin },
      });
      child.once("error", reject);
      child.once("exit", (code, signal) => code === 0 ? resolve() : reject(new Error(`${script} failed (${signal ?? code})`)));
    });
  }
} finally {
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
