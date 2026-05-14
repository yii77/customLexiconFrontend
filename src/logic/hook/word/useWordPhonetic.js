import { useCallback, useEffect, useMemo, useState } from 'react';

import { getWordPhonetic, getUserSetting } from '../../../data//local/dao';

import { playYoudaoPronunciation } from '../../service';

export function useWordPhonetic(word) {
  const [phonetics, setPhonetics] = useState({
    us: '',
    uk: '',
  });

  const [phoneticType, setPhoneticType] = useState('uk');

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!word) return;

      try {
        const [wordPhonetic, settings] = await Promise.all([
          getWordPhonetic(word),
          getUserSetting(),
        ]);

        if (!mounted) return;

        setPhonetics({
          us: wordPhonetic?.usPhonetic ?? '',
          uk: wordPhonetic?.ukPhonetic ?? '',
        });

        setPhoneticType(settings?.pronunciationType ?? 'uk');
      } catch (error) {
        console.log('获取音标失败', error);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [word]);

  const formatPhonetic = useCallback(phonetic => {
    if (!phonetic) return '';

    return `/ ${phonetic.replace(/\[|\]/g, '')} /`;
  }, []);

  const phonetic = useMemo(() => {
    const raw = phoneticType === 'uk' ? phonetics.uk : phonetics.us;

    return formatPhonetic(raw);
  }, [phonetics, phoneticType, formatPhonetic]);

  const togglePhonetic = useCallback(() => {
    const newType = phoneticType === 'uk' ? 'us' : 'uk';

    setPhoneticType(newType);

    playYoudaoPronunciation(word, newType);
  }, [phoneticType, word]);

  const handlePronounce = useCallback(() => {
    playYoudaoPronunciation(word, phoneticType);
  }, [word, phoneticType]);

  return {
    phonetic,
    phoneticType,

    usPhonetic: phonetics.us,
    ukPhonetic: phonetics.uk,

    togglePhonetic,
    handlePronounce,
  };
}
