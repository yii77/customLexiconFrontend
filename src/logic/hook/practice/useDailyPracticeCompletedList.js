import { useEffect, useState } from 'react';

import { getTodayPracticeStats } from '../../../data/local/dao';

export function useDailyPracticeCompletedList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getTodayPracticeStats();

        if (cancelled) return;

        const normalized = result
          .map(i => ({
            word: i.word,
            wrongCount: Number(i.wrongCount ?? 0),
          }))
          .sort((a, b) => b.wrongCount - a.wrongCount);

        setList(normalized);
      } catch (err) {
        console.log('获取本次练习数据失败', err);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { list };
}
