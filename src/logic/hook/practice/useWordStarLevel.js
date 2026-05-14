import { useCallback, useState } from 'react';

import { updateWordStarLevel } from '../../../data/local/dao';

export function useStarLevel(level) {
  const [currentStarLevel, setCurrentStarLevel] = useState(level);

  const updateStarLevel = useCallback(async (word, newStarLevel) => {
    await updateWordStarLevel(word, newStarLevel);
    setCurrentStarLevel(newStarLevel);
  }, []);

  return { currentStarLevel, updateStarLevel };
}
