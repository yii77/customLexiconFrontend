import { useState, useEffect, useCallback, useRef } from 'react';

import { generateArticle } from '../../../data/api';

import {
  getWordErrorList,
  getLearnedStatusWordGroups,
  getUserSetting,
  getTodayWords,
} from '../../../data/local/dao';

export function usePracticeArticle(wordArray) {
  const [articleData, setArticleData] = useState(null);

  const cacheRef = useRef(null);

  const init = useCallback(async () => {
    try {
      const [statusGroups, errors, wordLimit] = await Promise.all([
        getLearnedStatusWordGroups(),
        getWordErrorList(),
        getUserSetting('article_word_limit'),
      ]);

      const masteredRaw = statusGroups[1] || [];
      const learningRaw = statusGroups[0] || [];

      const todayWords = wordArray?.length ? wordArray : await getTodayWords();

      const todaySet = new Set(todayWords);

      const mastered = masteredRaw.filter(word => !todaySet.has(word));
      const learning = learningRaw.filter(word => !todaySet.has(word));

      cacheRef.current = {
        mastered,
        learning,
        errors,
        today: todayWords,
        wordLimit,
      };

      await generate();
    } catch (err) {
      console.log('init article error:', err);
    }
  }, [wordArray]);

  const generate = useCallback(async () => {
    try {
      if (!cacheRef.current) return;

      setArticleData(null);

      const result = await generateArticle(cacheRef.current);
      setArticleData(result);
    } catch (err) {
      console.log('generate article error:', err);
    }
  }, []);

  // ---------------------------
  // 初始化
  // ---------------------------
  useEffect(() => {
    init();
  }, [init]);

  return {
    articleData,
    generate,
  };
}
