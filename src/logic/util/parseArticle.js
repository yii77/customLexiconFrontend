export function parseArticle(text) {
  if (!text) return [];

  return text.match(/[a-zA-Z'-]+|[.,!?;:"()]/g) ?? [];
}
