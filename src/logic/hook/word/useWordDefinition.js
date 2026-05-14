import { useEffect, useState } from 'react';

import { getWordDefinition, getUserSetting } from '../../../data/local/dao';

export function useWordDefinition(word) {
  const [definition, setDefinition] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [def, showDefinition, styleType] = await Promise.all([
        getWordDefinition(word),
        getUserSetting('show_definition'),
        getUserSetting('definition_style_type'),
      ]);

      if (showDefinition) {
        setDefinition({
          content: def,
          styleType,
        });
      }
    };

    load();
  }, [word]);

  return { definition };
}
