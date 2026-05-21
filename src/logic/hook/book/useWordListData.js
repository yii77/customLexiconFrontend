import { useState, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchWordListData } from '../../../data/local/repository';

import { getUserSetting, setUserSetting } from '../../../data/local/dao';

import { DISPLAY_ORDER } from '../../../data/constants';

import { useCustomAlert } from '../../../presentation/component/system';

export function useWordListData() {
  const [displayBook, setDisplayBook] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(DISPLAY_ORDER.UNIT);

  const [listData, setListData] = useState([]);

  const { hideAlert } = useCustomAlert();

  useEffect(() => {
    (async () => {
      const [displayBook, practiceBook, order] = await Promise.all([
        AsyncStorage.getItem('displayBook'),
        AsyncStorage.getItem('practiceBook'),
        getUserSetting('display_order'),
      ]);
      if (displayBook) {
        setDisplayBook(JSON.parse(displayBook));
      } else {
        await AsyncStorage.setItem('displayBook', JSON.stringify(practiceBook));
        setDisplayBook(JSON.parse(practiceBook));
      }
      if (order) setDisplayOrder(order);
    })();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!displayBook) return;

      const result = await fetchWordListData(displayBook._id, displayOrder);
      setListData(result);
    };
    load();
  }, [displayBook, displayOrder]);

  const updateDisplayOrder = useCallback(
    async value => {
      if (value === displayOrder) return;
      setListData([]);
      setDisplayOrder(value);
      await setUserSetting('display_order', value);
    },
    [displayOrder],
  );

  const updateDisplayBook = useCallback(
    async book => {
      if (book === displayBook) {
        hideAlert();
        return;
      }
      setListData([]);
      setDisplayBook(book);
      await AsyncStorage.setItem(
        'displayBook',
        JSON.stringify({ _id: book._id, name: book.name }),
      );
      hideAlert();
    },
    [displayBook],
  );

  const isGrouped = displayOrder !== DISPLAY_ORDER.WORD_ORDER;

  return {
    displayBook,
    updateDisplayBook,

    displayOrder,
    updateDisplayOrder,

    isGrouped,
    listData,
  };
}
