import CategoryMainCard from './CategoryMainCard';
import Care34Card from './Care34Card';
import { CATEGORY_INDEX_REGISTRY } from '@/constants/package-data';

export { default as CategoryMainCard } from './CategoryMainCard';
export { default as Care34Card } from './Care34Card';
export { default as PackageItemCard } from './PackageItemCard';
export { default as AddOnPackageCard } from './AddOnPackageCard';
export * from './PackageItemCard';
export * from './AddOnPackageCard';

export const ALL_CATEGORY_CARDS = Object.values(CATEGORY_INDEX_REGISTRY).map((cat) => ({
  id: cat.id,
  name: cat.title,
  category: cat,
  component: CategoryMainCard,
  keywords: [
    cat.id,
    cat.title,
    cat.subtitle,
    ...cat.aliases,
    ...cat.subcategories,
  ].map((k) => k.toLowerCase()),
}));
