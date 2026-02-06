import { StoreCategory } from '../backend';

// Fixed store category options with exact English labels
export const STORE_CATEGORIES = [
  { value: StoreCategory.clothStore, label: 'Cloth Store' },
  { value: StoreCategory.cosmeticStore, label: 'Cosmetic Store' },
  { value: StoreCategory.groceryStore, label: 'Grocery Store' },
] as const;

// Helper to get label from StoreCategory enum value
export function getStoreCategoryLabel(category: StoreCategory): string {
  const found = STORE_CATEGORIES.find((c) => c.value === category);
  return found?.label || 'Unknown';
}

// Helper to parse and validate route param to StoreCategory
export function parseStoreCategory(param: string): StoreCategory | null {
  const normalized = param.toLowerCase().replace(/\s+/g, '');
  
  switch (normalized) {
    case 'clothstore':
    case 'cloth':
      return StoreCategory.clothStore;
    case 'cosmeticstore':
    case 'cosmetic':
      return StoreCategory.cosmeticStore;
    case 'grocerystore':
    case 'grocery':
      return StoreCategory.groceryStore;
    default:
      return null;
  }
}

// Helper to get URL-friendly slug from StoreCategory
export function getStoreCategorySlug(category: StoreCategory): string {
  switch (category) {
    case StoreCategory.clothStore:
      return 'cloth';
    case StoreCategory.cosmeticStore:
      return 'cosmetic';
    case StoreCategory.groceryStore:
      return 'grocery';
    default:
      return 'unknown';
  }
}
