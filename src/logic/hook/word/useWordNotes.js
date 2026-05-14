import { useState, useEffect } from 'react';

import { getNotesByWord } from '../../../data/local/repository';

export function useWordNotes(word) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const allNotes = await getNotesByWord(word);
      setNotes(allNotes);
    };
    load();
  }, [word]);

  return { notes };
}
