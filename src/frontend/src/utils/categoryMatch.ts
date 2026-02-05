import type { Category } from '../backend';

/**
 * Find a category by name using case-insensitive comparison
 * @param categories - Array of categories to search
 * @param name - Name to search for (case-insensitive)
 * @returns Matched category or undefined
 */
export function findCategoryByName(categories: Category[], name: string): Category | undefined {
  const normalizedName = name.toLowerCase().trim();
  return categories.find(cat => cat.name.toLowerCase().trim() === normalizedName);
}
