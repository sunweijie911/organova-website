export function parseFormats(formats?: string | null): string[] {
  if (!formats) return [];
  return formats
    .split(/[,;|]/)
    .map((f) => f.trim())
    .filter(Boolean);
}
