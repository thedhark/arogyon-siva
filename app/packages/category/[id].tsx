import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import CategoryScreenLayout from '@/components/packages/CategoryScreenLayout';

export default function DynamicCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryScreenLayout categorySlug={id || 'skin'} />;
}
