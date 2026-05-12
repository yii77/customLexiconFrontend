import { useContext, useState, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { getBookWordCountByStatus } from '../../../data/local/repository';

import { PracticeBookContext } from '../../context';

export function usePracticeBookCardData() {
  const { practiceBook } = useContext(PracticeBookContext);
  const [wordStatusCount, setWordStatusCount] = useState(null);

  const loadWordStatusGroup = async () => {
    try {
      const group = await getBookWordCountByStatus(practiceBook?._id);
      setWordStatusCount(group);
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      loadWordStatusGroup();
    }, [practiceBook?._id]),
  );

  return {
    practiceBook,
    wordStatusCount,
  };
}
