export function getUniqueParticleCategories(
  items: Array<{ category?: string[] }>
): Array<{ name: string; slug: string }> {
  const categories = new Set<string>();
  for (const item of items) {
    if (item.category) {
      for (const c of item.category) {
        categories.add(c);
      }
    }
  }
  return Array.from(categories)
    .sort()
    .map((category) => ({
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, "-"),
    }));
}
