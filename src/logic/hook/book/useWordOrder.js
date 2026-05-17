import { useState, useCallback, useEffect } from 'react';

import { updateWordOrders } from '../../../data/local/dao';

export function useWordOrder(bookId, initialWords) {
  const [words, setWords] = useState(initialWords);

  useEffect(() => {
    setWords(initialWords);
  }, [initialWords]);

  const handleReorder = useCallback(
    async newData => {
      setWords(newData);

      const changed = newData
        .filter((item, index) => item.wordOrder !== index + 1)
        .map((item, _) => ({
          word: item.word,
          wordOrder: newData.indexOf(item) + 1,
        }));

      await updateWordOrders(bookId, changed);
    },
    [bookId],
  );

  return { words, handleReorder };
}
