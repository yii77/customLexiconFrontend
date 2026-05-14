import { useState, useEffect, useContext, useCallback, useRef } from 'react';

import { useRoute, useFocusEffect } from '@react-navigation/native';

import { fetchPracticeWords } from '../../../data/local/repository';

import {
  getCompletedStep,
  incrementDailyPractice,
} from '../../../data/local/dao';

import { PracticeBookContext } from '../../context';

import { getPracticeData, calNextReviewTime } from '../../service';

const ACTIVE_POOL_SIZE = 5;

export function usePracticeData() {
  const route = useRoute();
  const { newCount, reviewCount, completedCount, practiceMode } = route.params;

  const { practiceBook } = useContext(PracticeBookContext);

  const [practiceWordArray, setPracticeWordArray] = useState(null);
  const [practiceWordMap, setPracticeWordMap] = useState(null);
  const [taskActivePool, setTaskActivePool] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [progress, setProgress] = useState({
    total: completedCount + newCount + reviewCount,
    completed: completedCount,
  });

  const practiceWordArrayRef = useRef(null);
  const practiceWordMapRef = useRef(null);
  const currentWordRef = useRef(null);
  const statusRef = useRef('unanswered');

  useEffect(() => {
    practiceWordMapRef.current = practiceWordMap;
  }, [practiceWordMap]);

  useEffect(() => {
    practiceWordArrayRef.current = practiceWordArray;
  }, [practiceWordArray]);

  useEffect(() => {
    let cancelled = false;
    async function loadPracticeData() {
      try {
        if (practiceBook === null) return;

        const { newWords, reviewWords } = await fetchPracticeWords({
          newCount,
          reviewCount,
          bookId: practiceBook._id,
        });

        const practiceData = await getPracticeData({
          newWords,
          reviewWords,
          practiceMode,
        });

        if (cancelled) return;
        setTaskActivePool(
          practiceData.practiceWordArray.slice(0, ACTIVE_POOL_SIZE),
        );
        setPracticeWordArray(
          practiceData.practiceWordArray.slice(ACTIVE_POOL_SIZE),
        );
        setPracticeWordMap(practiceData.practiceWordMap);
      } catch (error) {
        console.log(error);
      }
    }

    loadPracticeData();

    return () => {
      cancelled = true;
    };
  }, [practiceBook]);

  useEffect(() => {
    async function loadCurrentWord() {
      if (!taskActivePool?.length || !practiceWordMapRef.current) {
        currentWordRef.current = null;
        return;
      }

      const word = taskActivePool[0];
      const date = new Date().toISOString().slice(0, 10);

      const completedStep = await getCompletedStep(word, date);

      const step = completedStep + 1;
      const flow = practiceWordMapRef.current[word].flow[step - 1];
      const totalStep = practiceWordMapRef.current[word].flow.length;
      const starLevel = practiceWordMapRef.current[word].starLevel;

      const wordInfo = {
        word,
        step,
        flow,
        starLevel,
        totalStep,
      };

      setCurrentWord(wordInfo);
      currentWordRef.current = wordInfo;

      statusRef.current = 'unanswered';
    }

    loadCurrentWord();
  }, [taskActivePool, practiceWordMap]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        const status = statusRef.current;
        const currentWord = currentWordRef.current?.word;

        if (!currentWord) return;

        if (status === 'unanswered') return;

        if (status === 'correct') completeStep(2);
        else if (status === 'fuzzy') completeStep(1);
        else if (status === 'wrong') completeStep(0);
      };
    }, [completeStep]),
  );

  const completeStep = useCallback(async (feedback = 0) => {
    try {
      const date = new Date().toISOString().slice(0, 10);

      const currentWord = currentWordRef.current;

      if (!currentWord || !practiceWordMapRef.current) return;

      const word = currentWord.word;

      const totalSteps = practiceWordMapRef.current[word].flow.length;

      const feedbackMap = {
        0: ['wrong', 0],
        1: ['fuzzy', currentWord.step - 1],
        2: ['correct', currentWord.step],
      };

      if (feedbackMap[feedback]) {
        await incrementDailyPractice(
          word,
          date,
          practiceWordMapRef.current[word].type,
          totalSteps,
          ...feedbackMap[feedback],
        );
      }

      const nextItem = practiceWordArrayRef.current?.[0] ?? null;

      const isLastStep = currentWord.step === totalSteps;

      setTaskActivePool(prev => {
        const next = prev.slice(1);

        if (feedback === 2 && isLastStep) {
          if (nextItem) next.push(nextItem);
        } else {
          next.push(word);
        }

        return next;
      });

      if (feedback === 2 && isLastStep) {
        setPracticeWordArray(prev => {
          if (!prev?.length) return prev;
          return prev.slice(1);
        });

        await calNextReviewTime(
          word,
          practiceWordMapRef.current[word].practiceStage,
          currentWord.starLevel,
        );

        setProgress(prev => {
          const newProgrss = { ...prev, completed: prev.completed + 1 };
          return newProgrss;
        });
      }
    } catch (error) {
      console.log('答题失败', error);
    }
  }, []);

  const updateStatus = useCallback(feedback => {
    const statusMap = {
      0: 'wrong',
      1: 'fuzzy',
      2: 'correct',
    };

    statusRef.current = statusMap[feedback];
  }, []);

  return {
    currentWord,
    progress,
    completeStep,
    updateStatus,
  };
}
