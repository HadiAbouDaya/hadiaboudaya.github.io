export type VaultAsset = { id: string; mime: string; bytes: number; width?: number; height?: number };
export type VaultPhoto = { id: string; width: number; height: number; thumb: VaultAsset; medium: VaultAsset; full: VaultAsset; alt: string; group: string };
export type VaultChapter = { id: string; title: string; dateLabel: string; source: string; coverId: string; order: number };
export type VaultManifest = {
  version: 1;
  album: { title: string; subtitle: string; coverIds: string[] };
  chapters: VaultChapter[];
  photos: VaultPhoto[];
  birthday: { text: Record<string, string>; assets: Record<string, VaultAsset>; photos: { asset: string; alt: string; shape: string }[] };
};
export type VaultConfig = {
  version: 1; release: string;
  kdf: { name: "PBKDF2"; hash: "SHA-256"; iterations: number; salt: string };
  wrappedKey: { iv: string; data: string };
  manifest: VaultAsset;
};

const encoder = new TextEncoder();
export const vaultAAD = (release: string, id: string) => encoder.encode(`luna-vault:1:${release}:${id}`);
export const keyAAD = (release: string) => encoder.encode(`luna-vault-key:1:${release}`);
export function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
export function toBase64(value: ArrayBuffer | Uint8Array): string {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let result = "";
  for (const byte of bytes) result += String.fromCharCode(byte);
  return btoa(result);
}
export function validateVaultConfig(value: unknown): asserts value is VaultConfig {
  const config = value as VaultConfig;
  if (!config || config.version !== 1 || !/^[a-f0-9-]{36}$/.test(config.release) ||
    config.kdf?.name !== "PBKDF2" || config.kdf.hash !== "SHA-256" ||
    !Number.isInteger(config.kdf.iterations) || config.kdf.iterations < 600_000 || config.kdf.iterations > 2_000_000 ||
    typeof config.kdf.salt !== "string" || fromBase64(config.kdf.salt).length !== 16 ||
    typeof config.wrappedKey?.iv !== "string" || fromBase64(config.wrappedKey.iv).length !== 12 ||
    typeof config.wrappedKey.data !== "string" || fromBase64(config.wrappedKey.data).length !== 48 ||
    !validAsset(config.manifest) || config.manifest.mime !== "application/json") throw new Error("Invalid album configuration");
}
export function validAsset(value: unknown): value is VaultAsset {
  const asset = value as VaultAsset;
  return !!asset && /^[a-f0-9-]{36}$/.test(asset.id) && Number.isSafeInteger(asset.bytes) && asset.bytes >= 28 && typeof asset.mime === "string";
}
export function validateManifest(value: unknown): asserts value is VaultManifest {
  const manifest = value as VaultManifest;
  if (!manifest || manifest.version !== 1 || !Array.isArray(manifest.photos) || manifest.photos.length > 10_000 ||
      !Array.isArray(manifest.chapters) || !manifest.album || typeof manifest.album.title !== "string" ||
      !Array.isArray(manifest.album.coverIds) || !manifest.birthday?.text || !manifest.birthday.assets || !Array.isArray(manifest.birthday.photos)) throw new Error("Invalid album contents");
  const ids = new Set<string>();
  for (const photo of manifest.photos) {
    if (!photo || typeof photo.id !== "string" || ids.has(photo.id) || !Number.isFinite(photo.width) || photo.width < 1 ||
      !Number.isFinite(photo.height) || photo.height < 1 || !validAsset(photo.thumb) || !validAsset(photo.medium) || !validAsset(photo.full) ||
      typeof photo.alt !== "string" || typeof photo.group !== "string") throw new Error("Invalid photograph");
    ids.add(photo.id);
  }
  for (const asset of Object.values(manifest.birthday.assets)) if (!validAsset(asset)) throw new Error("Invalid keepsake asset");
  const chapterIds = new Set<string>();
  for (const chapter of manifest.chapters) {
    if (!chapter || typeof chapter.id !== "string" || chapterIds.has(chapter.id) || typeof chapter.title !== "string" ||
      typeof chapter.dateLabel !== "string" || !ids.has(chapter.coverId)) throw new Error("Invalid chapter");
    chapterIds.add(chapter.id);
  }
  if (manifest.photos.some(photo => !chapterIds.has(photo.group)) || manifest.album.coverIds.some(id => !ids.has(id))) throw new Error("Invalid album references");
}
export async function deriveWrappingKey(password: string, config: VaultConfig, usages: KeyUsage[]) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64(config.kdf.salt), iterations: config.kdf.iterations }, material, { name: "AES-GCM", length: 256 }, false, usages);
}
export async function unlockVault(password: string, config: VaultConfig): Promise<CryptoKey> {
  validateVaultConfig(config);
  const wrappingKey = await deriveWrappingKey(password, config, ["unwrapKey"]);
  return crypto.subtle.unwrapKey("raw", fromBase64(config.wrappedKey.data), wrappingKey,
    { name: "AES-GCM", iv: fromBase64(config.wrappedKey.iv), additionalData: keyAAD(config.release), tagLength: 128 },
    { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
}
export async function decryptVaultObject(key: CryptoKey, release: string, asset: VaultAsset, bytes: ArrayBuffer): Promise<ArrayBuffer> {
  if (!validAsset(asset) || bytes.byteLength !== asset.bytes) throw new Error("Incomplete album file");
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12), additionalData: vaultAAD(release, asset.id), tagLength: 128 }, key, bytes.slice(12));
}
