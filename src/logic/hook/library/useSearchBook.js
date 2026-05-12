import { useState, useMemo, useCallback } from 'react';

export function useSearchBook(library = []) {
  const [keyword, setKeyword] = useState('');

  const bookArray = useMemo(() => {
    if (!keyword.trim()) return null;

    const lower = keyword.toLowerCase();

    return library.filter(item => item.name?.toLowerCase().includes(lower));
  }, [keyword, library]);

  const handleSearch = useCallback(() => {}, []);

  return {
    keyword,
    setKeyword,
    bookArray,
    handleSearch,
  };
}
