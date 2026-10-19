import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif", ".ico": "image/x-icon", ".pdf": "application/pdf", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".woff2": "font/woff2" };
export function createPreview(rootDir = "out") {
  const root = path.resolve(rootDir);
  return createServer(async (req, res) => {
    const reply = (status, message) => { res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }); res.end(req.method === "HEAD" ? undefined : message); };
    if (!["GET", "HEAD"].includes(req.method)) { res.setHeader("Allow", "GET, HEAD"); reply(405, "Method not allowed"); return; }
    let url, target, info;
    try {
      url = new URL(req.url, "http://localhost");
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.includes("\0") || decoded.includes("\\")) throw new Error("Invalid path");
      target = path.resolve(root, "." + decoded);
      if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Invalid path");
    } catch { reply(400, "Invalid path"); return; }
    try {
      info = await stat(target);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith("/")) { res.writeHead(308, { Location: url.pathname + "/" + url.search }); res.end(); return; }
        target = path.join(target, "index.html"); info = await stat(target);
      }
      if (!info.isFile()) throw new Error("Not a file");
      const real = await realpath(target), realRoot = await realpath(root);
      if (!real.startsWith(realRoot + path.sep)) { reply(403, "Forbidden"); return; }
    } catch {
      try { target = path.join(root, "404.html"); info = await stat(target); res.statusCode = 404; }
      catch { reply(404, "Not found"); return; }
    }
    res.setHeader("Content-Type", TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Accept-Ranges", "bytes");
    let start = 0, end = info.size - 1;
    if (req.headers.range && res.statusCode !== 404) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), end) : end;
      } else start = -1;
      if (start < 0 || start >= info.size || start > end) { res.setHeader("Content-Range", `bytes */${info.size}`); res.writeHead(416); res.end(); return; }
      res.statusCode = 206; res.setHeader("Content-Range", `bytes ${start}-${end}/${info.size}`);
    }
    res.setHeader("Content-Length", Math.max(0, end - start + 1));
    if (req.method === "HEAD" || info.size === 0) { res.end(); return; }
    const stream = createReadStream(target, { start, end });
    stream.on("error", () => res.destroy()); stream.pipe(res);
  });
}
export function previewOptions(args, env = process.env) {
  let root = "out", port = env.PORT ?? "3000", host = env.HOST ?? "127.0.0.1", hasRoot = false;
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === "--") continue;
    if (argument === "--port" || argument === "-p") port = args[++index];
    else if (argument.startsWith("--port=")) port = argument.slice(7);
    else if (argument === "--host") host = args[++index];
    else if (argument.startsWith("--host=")) host = argument.slice(7);
    else if (!argument.startsWith("-") && !hasRoot) { root = argument; hasRoot = true; }
    else throw new Error(`Unknown preview argument: ${argument}`);
  }
  if (!/^\d+$/.test(String(port)) || Number(port) < 0 || Number(port) > 65535) throw new Error("Preview port must be an integer from 0 to 65535");
  if (!host) throw new Error("Preview host must not be empty");
  return { root, port: Number(port), host };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const { root, port, host } = previewOptions(process.argv.slice(2));
    const server = createPreview(root);
    server.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
    server.listen(port, host, () => console.log(`Static preview: http://${host}:${server.address().port}`));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
