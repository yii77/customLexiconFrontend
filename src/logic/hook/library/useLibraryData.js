import { useMemo, useState, useEffect } from 'react';

import { extractCategory, filterBooksByCategory } from '../../util';

export function useLibraryData(library) {
  const { categoryArray, categoryMap } = useMemo(
    () => extractCategory(library),
    [library],
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    if (categoryArray.length === 0) return;
    const firstCategory = categoryArray[0];
    const firstSubcategory = (categoryMap[firstCategory] ?? [])[0] ?? null;
    setSelectedCategory(firstCategory);
    setSelectedSubcategory(firstSubcategory);
  }, [categoryArray]);

  const handleCategoryChange = cat => {
    setSelectedCategory(cat);
    setSelectedSubcategory((categoryMap[cat] ?? [])[0] ?? null);
  };

  const subcategoryArray = categoryMap[selectedCategory] ?? [];

  const bookArray = useMemo(() => {
    if (!library.length || !selectedCategory || !selectedSubcategory) return [];
    return filterBooksByCategory(
      library,
      selectedCategory,
      selectedSubcategory,
    );
  }, [library, selectedCategory, selectedSubcategory]);

  return {
    categoryArray,
    subcategoryArray,
    bookArray,
    selectedCategory,
    selectedSubcategory,
    handleCategoryChange,
    handleSubcategoryChange: setSelectedSubcategory,
  };
}
