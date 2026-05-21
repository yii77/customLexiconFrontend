import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const PracticeBookContext = createContext(null);

export function PracticeBookProvider({ children }) {
  const [practiceBook, setPracticeBook] = useState(null);

  const loadPracticeBook = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('practiceBook');
      if (!data) {
        setPracticeBook(null);
        return;
      }
      setPracticeBook(JSON.parse(data));
    } catch (error) {
      console.log('读取词书失败', error);
    }
  }, []);

  const savePracticeBook = async book => {
    const displayBook = await AsyncStorage.getItem('displayBook');

    const stored = JSON.stringify({ _id: book._id, name: book.name });
    if (practiceBook === displayBook) {
      await AsyncStorage.setItem('practiceBook', stored);
    }
    await AsyncStorage.setItem('practiceBook', stored);
    await loadPracticeBook();
  };

  useEffect(() => {
    loadPracticeBook();
  }, []);

  const value = useMemo(
    () => ({
      practiceBook,
      savePracticeBook,
    }),
    [practiceBook],
  );

  return (
    <PracticeBookContext.Provider value={value}>
      {children}
    </PracticeBookContext.Provider>
  );
}
