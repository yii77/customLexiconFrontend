import { useState, useCallback } from 'react';

export function useArticleWordQuery() {
  const [selectedWord, setSelectedWord] = useState(null);

  const handlePress = useCallback(async word => {
    if (!/^[a-zA-Z'-]+$/.test(word)) {
      return;
    }

    try {
      setSelectedWord(word);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return {
    selectedWord,
    handlePress,
  };
}
