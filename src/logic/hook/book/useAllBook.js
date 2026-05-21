import { useState, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { getUserBooks } from '../../../data/local/repository';

import { getWordCountByBookId } from '../../../data/local/dao';

export function useAllBook(practiceBook) {
  const [allBook, setAllBook] = useState([]);

  const load = async () => {
    const [userBook, practiceBookCount] = await Promise.all([
      getUserBooks(),
      getWordCountByBookId(practiceBook?._id),
    ]);

    const practiceBookData = practiceBook
      ? {
          ...practiceBook,
          wordCount: practiceBookCount,
        }
      : null;

    const data = [
      {
        category: '在学词书',
        books: practiceBookData ? [practiceBookData] : [],
      },
      {
        category: '单词本',
        books: userBook.filter(item => item.category === '单词本'),
      },
      {
        category: '笔记本',
        books: userBook.filter(item => item.category === '笔记本'),
      },
    ];

    setAllBook(data);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [practiceBook]),
  );

  return { allBook };
}
