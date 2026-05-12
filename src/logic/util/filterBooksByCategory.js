export function filterBooksByCategory(
  library,
  selectedCategory,
  selectedSubcategory,
) {
  if (!selectedCategory) return null;

  const isMyCategory = selectedCategory === '我的';

  return library.filter(book => {
    const isDownloaded = book.owner === 'system' && !!book.created_at;

    const isUserBook = book.owner !== 'system';

    const isInMy = isDownloaded || isUserBook;

    if (isMyCategory) {
      if (!isInMy) {
        return false;
      } else if (selectedSubcategory === '全部') {
        return isInMy;
      } else if (selectedSubcategory === '下载') {
        return isDownloaded;
      }
      return book.subcategory === selectedSubcategory;
    } else {
      if (isInMy) {
        return false;
      } else if (selectedSubcategory === '全部') {
        return selectedCategory === book.category;
      }
      return book.subcategory === selectedSubcategory;
    }
  });
}
