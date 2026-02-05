// Deterministic category color utility
// Maps category IDs to consistent colorful backgrounds

const categoryColorPalette = [
  'bg-gradient-to-br from-red-400 to-pink-500',
  'bg-gradient-to-br from-orange-400 to-amber-500',
  'bg-gradient-to-br from-yellow-400 to-orange-500',
  'bg-gradient-to-br from-green-400 to-emerald-500',
  'bg-gradient-to-br from-teal-400 to-cyan-500',
  'bg-gradient-to-br from-blue-400 to-indigo-500',
  'bg-gradient-to-br from-purple-400 to-violet-500',
  'bg-gradient-to-br from-pink-400 to-rose-500',
];

export function getCategoryColor(categoryId: string): string {
  // Use a simple hash function to deterministically map category ID to color
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = categoryId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % categoryColorPalette.length;
  return categoryColorPalette[index];
}
