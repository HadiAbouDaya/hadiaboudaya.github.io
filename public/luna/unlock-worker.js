// Static worker: passphrase derivation never blocks the album interface.
self.onmessage = async ({ data: { password, config } }) => {
  try {
    const decode = (value) => Uint8Array.from(atob(value), character => character.charCodeAt(0));
    const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    const wrapping = await crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: decode(config.kdf.salt), iterations: config.kdf.iterations }, material, { name: "AES-GCM", length: 256 }, false, ["unwrapKey"]);
    password = "";
    const key = await crypto.subtle.unwrapKey("raw", decode(config.wrappedKey.data), wrapping,
      { name: "AES-GCM", iv: decode(config.wrappedKey.iv), additionalData: new TextEncoder().encode(`luna-vault-key:1:${config.release}`), tagLength: 128 },
      { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    self.postMessage({ key });
  } catch {
    self.postMessage({ error: "Unable to unlock" });
  }
};
