import { useState, useCallback } from 'react';

import { getUserSetting, setUserSetting } from '../../../data/local/dao';

import { DEFAULT_SETTINGS } from '../../../data/constants';

import { useCustomAlert } from '../../../presentation/component/system';

export function useBrushMode() {
  const [brushModes, setBrushModes] = useState(DEFAULT_SETTINGS.brush_modes);

  const { showAlert, hideAlert } = useCustomAlert();

  const load = useCallback(async () => {
    const modes = await getUserSetting('brush_modes');
    if (modes) setBrushModes(modes);
  }, []);

  const handleToggle = useCallback((stageIndex, modeId) => {
    setBrushModes(prev => {
      const currentGroup = prev[stageIndex];

      const enabledCount = currentGroup.filter(item => item.value).length;

      const target = currentGroup.find(item => item.id === modeId);

      if (target?.value && enabledCount === 1) {
        showAlert({
          title: '提示',
          content: '至少需要保留一个练习模式',
          buttons: [
            {
              text: '确定',
              onPress: hideAlert,
            },
          ],
          type: 'center',
        });
        return prev;
      }

      const next = prev.map((group, i) =>
        i !== stageIndex
          ? group
          : group.map(item =>
              item.id === modeId ? { ...item, value: !item.value } : item,
            ),
      );
      setUserSetting('brush_modes', next);
      return next;
    });
  }, []);

  const handleReorder = useCallback((stageIndex, newData) => {
    setBrushModes(prev => {
      const next = prev.map((group, i) => (i === stageIndex ? newData : group));
      setUserSetting('brush_modes', next);
      return next;
    });
  }, []);

  return { brushModes, load, handleToggle, handleReorder };
}
