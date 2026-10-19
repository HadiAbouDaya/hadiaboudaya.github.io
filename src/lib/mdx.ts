import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";
import type { BlogPost, BlogSearchPost } from "@/types";
import { parseDate } from "./dates";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const FIELDS = new Set(["title", "date", "updatedAt", "tags", "excerpt", "coverImage"]);
export type BlogPostSummary = Omit<BlogPost, "content">;

interface MarkdownNode { type: string; url?: string; children?: MarkdownNode[] }
const MARKDOWN_NODES = new Set([
  "root", "paragraph", "heading", "text", "emphasis", "strong", "delete", "blockquote",
  "list", "listItem", "thematicBreak", "break", "code", "inlineCode", "link", "image",
  "linkReference", "imageReference", "definition", "table", "tableRow", "tableCell",
  "footnoteDefinition", "footnoteReference",
]);

/** Pass before renderer transforms so unexpected syntax fails instead of being silently removed. */
export function remarkValidateMdx() {
  return (tree: MarkdownNode) => {
    function visit(node: MarkdownNode) {
      if (!MARKDOWN_NODES.has(node.type)) throw new Error(`Unsupported article syntax: ${node.type}`);
      if (node.url) {
        const url = new URL(node.url, "https://hadi.aboudaya.com");
        if (!["https:", "http:", "mailto:"].includes(url.protocol)) throw new Error("Unsupported article link protocol");
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

function invalid(slug: string, message: string): never {
  throw new Error(`Blog ${JSON.stringify(slug)}: ${message}`);
}

/** Apply a prose transform without rewriting fenced or inline code examples. */
function mapMarkdownProse(
  content: string,
  transform: (text: string) => string,
  slug: string,
  code: (text: string) => string = (text) => text,
): string {
  let fence: { character: string; length: number } | undefined;
  const lines = content.split(/\r?\n/).map((line) => {
    const opening = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      const closing = /^ {0,3}(`+|~+)\s*$/.exec(line);
      if (closing && closing[1][0] === fence.character && closing[1].length >= fence.length) fence = undefined;
      return code(line);
    }
    if (opening && (opening[1][0] !== "`" || !opening[2].includes("`"))) {
      fence = { character: opening[1][0], length: opening[1].length };
      return code(line);
    }
    let output = "";
    let segmentStart = 0;
    for (let index = 0; index < line.length;) {
      const escaped = /(?:^|[^\\])(?:\\\\)*\\$/.test(line.slice(0, index));
      if (line[index] === "`" && !escaped) {
        const run = /^`+/.exec(line.slice(index))![0];
        let end = index + run.length;
        let match = -1;
        while (end < line.length) {
          const found = line.indexOf("`", end);
          if (found < 0) break;
          const closing = /^`+/.exec(line.slice(found))![0];
          if (closing.length === run.length) { match = found; break; }
          end = found + closing.length;
        }
        if (match >= 0) {
          output += transform(line.slice(segmentStart, index));
          output += code(line.slice(index, match + run.length));
          segmentStart = index = match + run.length;
          continue;
        }
      }
      index++;
    }
    return output + transform(line.slice(segmentStart));
  });
  if (fence) invalid(slug, "unclosed fenced code block");
  return lines.join("\n");
}

/** Markdown/GFM and literal code only; parsed-node validation at render time is authoritative. */
export function validateMdxBody(content: string, slug = "source"): void {
  const outsideCode = mapMarkdownProse(content, (text) => text, slug, () => " ")
    .replace(/\\[\\`{}<>]/g, " ");
  // Blockquotes, autolinks and comparisons are ordinary Markdown, not JSX.
  if (/[{}]|<(?:\/?[A-Za-z][\w:.-]*(?:\s|\/?>)|!--|!DOCTYPE\b|[?])|<>|<\/>/.test(outsideCode)) {
    invalid(slug, "JSX, HTML and expressions are not allowed outside code examples");
  }
  if (/^\s*(?:import|export)\b/m.test(outsideCode)) invalid(slug, "imports and exports are not allowed outside code examples");
}

/** MDX lacks Markdown autolinks; normalize those and literal comparison signs before compilation. */
export function normalizeMarkdownProse(content: string, slug = "source"): string {
  validateMdxBody(content, slug);
  return mapMarkdownProse(content, (text) => text
    .replace(/<((?:https?:\/\/)[^\s<>]+)>/g, (_all, url: string) => `[${url}](${url})`)
    .replace(/<([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})>/g, (_all, email: string) => `[${email}](mailto:${email})`)
    .replace(/\\</g, "&lt;")
    .replace(/</g, "&lt;"), slug);
}

export function parseBlogSource(source: string, slug: string): BlogPost {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) invalid(slug, "invalid slug");
  const input = source.replace(/^\uFEFF/, "");
  // Only YAML is accepted; there is no executable frontmatter engine.
  const opening = input.split(/\r?\n/, 1)[0];
  if (!/^---(?:\s*yaml)?\s*$/.test(opening)) invalid(slug, "expected YAML frontmatter (---), with no other engine");
  const lines = input.split(/\r?\n/);
  const closing = lines.findIndex((line, index) => index > 0 && /^---[\t ]*$/.test(line));
  if (closing < 0) invalid(slug, "missing closing YAML delimiter");
  const frontmatter = lines.slice(1, closing).join("\n");
  if (Buffer.byteLength(frontmatter, "utf8") > 65536) invalid(slug, "YAML frontmatter exceeds 64 KiB");
  const document = parseDocument(frontmatter, { strict: true, uniqueKeys: true });
  if (document.errors.length || document.warnings.length) invalid(slug, "invalid YAML frontmatter");
  let parsed: unknown;
  try { parsed = document.toJS({ maxAliasCount: 0 }); }
  catch { invalid(slug, "YAML aliases are not supported"); }
  const content = lines.slice(closing + 1).join("\n");
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) invalid(slug, "frontmatter must be a mapping");
  const data = parsed as Record<string, unknown>;
  for (const key of Object.keys(data)) {
    if (!FIELDS.has(key)) invalid(slug, `unknown frontmatter field ${JSON.stringify(key)}`);
  }
  function text(field: string): string {
    const value: unknown = data[field];
    if (typeof value !== "string" || !value.trim()) invalid(slug, `${field} must be a nonempty string`);
    return value.trim();
  }
  const title = text("title");
  const date = text("date");
  parseDate(date);
  const updatedAt: string | undefined = data.updatedAt === undefined ? undefined : text("updatedAt");
  if (updatedAt && parseDate(updatedAt) < parseDate(date)) invalid(slug, "updatedAt cannot precede publication");
  const tags: unknown = data.tags;
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string" || !tag.trim())) invalid(slug, "tags must be an array of nonempty strings");
  const coverImage = text("coverImage");
  if (!/^\/Media\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif)$/.test(coverImage) || coverImage.includes("..")) invalid(slug, "coverImage must be a local /Media/ image");
  const coverPath = path.join(process.cwd(), "public", coverImage);
  if (!fs.existsSync(coverPath) || !fs.statSync(coverPath).isFile()) invalid(slug, `coverImage file is missing: ${coverImage}`);
  if (!content.trim()) invalid(slug, "article body is empty");
  const normalizedContent = normalizeMarkdownProse(content, slug);
  const words = content.trim().split(/\s+/).length;
  const post: BlogPost = {
    slug, title, date, ...(updatedAt ? { updatedAt } : {}),
    tags: [...new Set(tags.map((tag: string) => tag.trim()))],
    excerpt: text("excerpt"), coverImage,
    readingTime: Math.max(1, Math.ceil(words / 200)), content: normalizedContent,
  };
  Object.freeze(post.tags);
  return Object.freeze(post);
}

interface CachedFile { stamp: string; post: BlogPost }
interface Catalog {
  posts: BlogPost[];
  bySlug: Map<string, BlogPost>;
  summaries: BlogPostSummary[];
  searchItems: BlogSearchPost[];
}
let catalog: Catalog | undefined;
const fileCache = new Map<string, CachedFile>();

/** One catalog per server/build worker. Development checks file stats and reparses only changes. */
function getCatalog(): Catalog {
  if (catalog && process.env.NODE_ENV === "production") return catalog;
  if (!fs.existsSync(BLOG_DIR) || !fs.statSync(BLOG_DIR).isDirectory()) {
    throw new Error(`Expected blog content directory is missing: ${BLOG_DIR}`);
  }
  const files = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).map((entry) => entry.name).sort();
  const present = new Set(files);
  let changed = !catalog;
  for (const filename of fileCache.keys()) {
    if (!present.has(filename)) { fileCache.delete(filename); changed = true; }
  }
  for (const filename of files) {
    const fullPath = path.join(BLOG_DIR, filename);
    const stat = fs.statSync(fullPath);
    const stamp = `${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
    if (fileCache.get(filename)?.stamp === stamp) continue;
    const post = parseBlogSource(fs.readFileSync(fullPath, "utf8"), filename.slice(0, -4));
    fileCache.set(filename, { stamp, post });
    changed = true;
  }
  if (!changed && catalog) return catalog;
  const posts = [...fileCache.values()].map(({ post }) => post).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  catalog = {
    posts,
    bySlug: new Map(posts.map((post) => [post.slug, post])),
    summaries: posts.map((post) => {
      const { slug, title, date, updatedAt, tags, excerpt, coverImage, readingTime } = post;
      return Object.freeze({ slug, title, date, ...(updatedAt ? { updatedAt } : {}), tags, excerpt, coverImage, readingTime });
    }),
    searchItems: posts.map(({ slug, title, date, tags, excerpt }) => Object.freeze({ slug, title, date, tags, excerpt })),
  };
  return catalog;
}

export function getAllPosts(): BlogPost[] { return [...getCatalog().posts]; }
export function getPostBySlug(slug: string): BlogPost | undefined { return getCatalog().bySlug.get(slug); }
export function getAllSlugs(): string[] { return [...getCatalog().bySlug.keys()]; }
export function getAllPostSummaries(): BlogPostSummary[] { return [...getCatalog().summaries]; }
export function getAllPostSearchItems(): BlogSearchPost[] { return [...getCatalog().searchItems]; }
