import { publicProfileText } from "@/lib/public-profile";
export const dynamic = "force-static";
export function GET() { return new Response(publicProfileText(true), { headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
