import { useState, useEffect, useContext, useCallback } from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import {
  calcPracticeCount,
  hasUnpracticedWords,
} from '../../../data/local/repository';

import { getUserSetting, setUserSetting } from '../../../data/local/dao';

import {
  PRACTICE_MODE,
  PRACTICE_MODE_LABEL,
  PRACTICE_MODE_OPTIONS,
} from '../../../data/constants';

import { PracticeBookContext } from '../../context';

import { useCustomAlert } from '../../../presentation/component/system';

export function useDailyTaskCardData() {
  const [practiceMode, setPracticeMode] = useState(null);

  const [newCount, setNewCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const { practiceBook } = useContext(PracticeBookContext);

  const { showAlert, hideAlert } = useCustomAlert();

  const navigation = useNavigation();

  const load = async () => {
    try {
      if (!practiceBook) {
        return;
      }
      const mode = await getUserSetting('practice_mode');
      setPracticeMode(mode);

      const practice = await calcPracticeCount(
        mode === PRACTICE_MODE.REVIEW_ONLY,
      );

      setNewCount(practice.newCount > 0 ? practice.newCount : 0);
      setReviewCount(practice.reviewCount > 0 ? practice.reviewCount : 0);
      setCompletedCount(practice.completedCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, [practiceBook]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [practiceBook]),
  );

  const updatePracticeMode = async mode => {
    try {
      await setUserSetting('practice_mode', mode);
      if (
        mode === PRACTICE_MODE.REVIEW_ONLY ||
        practiceMode === PRACTICE_MODE.REVIEW_ONLY
      ) {
        await load();
      }
      setPracticeMode(mode);
    } catch (error) {
      console.error('updatePracticeMode failed:', error);
    }
  };

  const handleStartPractice = async () => {
    if (practiceBook === null) {
      showAlert({
        title: '提示',
        content: '还没有选择词书，先去挑选词书吧~',
        buttons: [
          { text: '取消', onPress: hideAlert },
          {
            text: '确定',
            onPress: () => {
              hideAlert();
              navigation.navigate('LibraryScreen');
            },
          },
        ],
        type: 'center',
      });
      return;
    }

    const hasNew = await hasUnpracticedWords(practiceBook._id);

    if (
      practiceMode != PRACTICE_MODE.REVIEW_ONLY &&
      !hasNew &&
      newCount === 0
    ) {
      showAlert({
        title: '提示',
        content: '该词书新词已学完，换一本词书吧~',
        buttons: [
          { text: '取消', onPress: hideAlert },
          {
            text: '确定',
            onPress: () => {
              hideAlert();
              navigation.navigate('LibraryScreen');
            },
          },
        ],
        type: 'center',
      });
      return;
    }

    if (newCount === 0 && reviewCount === 0) {
      showAlert({
        title: '提示',
        content: '今日单词已学完，是否生成短文进行强化？',
        buttons: [
          { text: '取消', onPress: hideAlert },
          {
            text: '确定',
            onPress: () => {
              hideAlert();
              navigation.navigate('ArticleScreen');
            },
          },
        ],
        type: 'center',
      });
      return;
    }

    navigation.navigate('PracticeScreen', {
      newCount,
      reviewCount,
      completedCount,
      practiceMode,
    });
  };

  return {
    practiceMode,
    currentPracticeMode: PRACTICE_MODE_LABEL[practiceMode],
    practiceModeOptions: PRACTICE_MODE_OPTIONS,

    newCount,
    reviewCount,
    completedCount,
    updatePracticeMode,
    handleStartPractice,
  };
}
