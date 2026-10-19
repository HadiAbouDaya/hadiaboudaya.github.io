// No customer-name blacklist: existing customer media paths/branding are approved.
// These markers describe private authoring inputs, not public professional facts.
const PRIVATE_MARKERS = [
  ["local workstation source path", /\/home\/oem\//i],
  ["build checkout source path", /\/home\/runner\/work\//i],
  ["private desktop source path", /\/Users\/[^/\s"<>]+\/(?:Desktop|Documents)\//i],
  ["private Windows source path", /[A-Z]:\/Users\/[^/\s"<>]+\/(?:Desktop|Documents)\//i],
  ["private Knowledge authoring reference", /(?:^|[\/"\s])Knowledge\/(?:MasterFile\.md|TODO\.md|README\.md|Sources\.md|Update_Log\.md|MediaGuide\.md|blogs\/|_archive\/|_updates\/)/i],
  ["implementation brief", /Hadi-Abou-Daya-Website-Implementation-Brief-2026-10-19\.md/i],
  ["private career confirmation source", /Career_Confirmations_2026-10-18\.md/i],
  ["internal provenance field", /["'](?:internalProvenance|privateProvenance|internalEvidencePath)["']\s*:/i],
];
export function privateAuthoringMarkers(text) {
  // Cover common JSON/RSC/HTML encodings without evaluating shipped scripts.
  const normalized = text.replace(/\\u002f|\\x2f|\\\//gi, "/")
    .replace(/&#(?:47|x2f);|&sol;/gi, "/")
    .replace(/\\u005c/gi, "\\").replace(/\\+/g, "/");
  return PRIVATE_MARKERS.filter(([, pattern]) => pattern.test(normalized)).map(([label]) => label);
}
