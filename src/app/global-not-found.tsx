import NotFound from "./not-found";

export { metadata } from "./not-found";

/** The static 404 bypasses both the portfolio and personal-space root layouts. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <NotFound />
      </body>
    </html>
  );
}
