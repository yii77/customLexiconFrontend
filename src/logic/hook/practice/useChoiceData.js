import { useState, useEffect } from 'react';

import { getWordWithDistractors } from '../../../data/local/repository';

export function useChoiceData(word) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    setData(null);

    async function loadData() {
      const result = await getWordWithDistractors(word);

      if (mounted) {
        setData(result);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [word]);

  return { data };
}
