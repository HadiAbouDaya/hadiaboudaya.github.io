import { PROFILE } from "@/data/profile";

export const SITE_URL = PROFILE.url;
export function pageUrl(path = "/") {
  const url = new URL(path, SITE_URL);
  if (url.origin !== SITE_URL) throw new Error(`Expected site page: ${path}`);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url.toString();
}
export function assetUrl(path: string) { return new URL(path, SITE_URL).toString(); }
