import { createContext, useEffect, useState } from 'react';

import { getUserSetting } from '../../data/local/dao';

export const FontContext = createContext(null);

export function FontProvider({ children }) {
  const [fonts, setFonts] = useState(null);

  const loadFonts = async () => {
    const en = await getUserSetting('english_font');
    const cn = await getUserSetting('chinese_font');

    setFonts({
      english: en,
      chinese: cn,
    });
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <FontContext.Provider value={{ fonts, reloadFonts: loadFonts }}>
      {children}
    </FontContext.Provider>
  );
}
