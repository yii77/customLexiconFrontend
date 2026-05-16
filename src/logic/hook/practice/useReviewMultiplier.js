import { useState, useCallback } from 'react';

import { getUserSetting, setUserSetting } from '../../../data/local/dao';

import { DEFAULT_SETTINGS } from '../../../data/constants';

import { useCustomAlert } from '../../../presentation/component/system';

export function useReviewMultiplier() {
  const [reviewMultiplier, setReviewMultiplier] = useState(
    DEFAULT_SETTINGS.review_multiplier,
  );
  const { showAlert, hideAlert } = useCustomAlert();

  const load = useCallback(async () => {
    const multiplier = await getUserSetting('review_multiplier');
    if (multiplier) setReviewMultiplier(multiplier);
  }, []);

  const handleEdit = useCallback(
    (index, val) => {
      const num = Number(val);

      if (isNaN(num)) {
        showAlert({
          title: '提示',
          content: '请输入有效数字',
          buttons: [
            {
              text: '确定',
              onPress: hideAlert,
            },
          ],
          type: 'center',
        });
        return { success: false };
      }

      const next = [...reviewMultiplier];
      next[index] = num;

      if ((index === 0 || index === 1) && num < 1) {
        showAlert({
          title: '提示',
          content: '一、二星单词的复习倍率必须大于1',
          buttons: [
            {
              text: '确定',
              onPress: hideAlert,
            },
          ],
          type: 'center',
        });
        return;
      }

      if ((index === 3 || index === 4) && num > 1) {
        showAlert({
          title: '提示',
          content: '三、四星单词的复习倍率必须小于1',
          buttons: [
            {
              text: '确定',
              onPress: hideAlert,
            },
          ],
          type: 'center',
        });
        return;
      }

      if (index < next.length - 1 && num < next[index + 1]) {
        showAlert({
          title: '提示',
          content: '该星级的复习倍率不能小于下一星级的复习倍率',
          buttons: [
            {
              text: '确定',
              onPress: hideAlert,
            },
          ],
          type: 'center',
        });
        return;
      }

      if (index > 0 && next[index - 1] < num) {
        showAlert({
          title: '提示',
          content: '该星级的复习倍率不能大于上一星级的复习倍率',
          buttons: [
            {
              text: '确定',
              onPress: hideAlert,
            },
          ],
          type: 'center',
        });
        return;
      }

      setReviewMultiplier(prev => {
        const updated = [...prev];
        updated[index] = num;

        setUserSetting('review_multiplier', updated);

        return updated;
      });

      return { success: true };
    },
    [reviewMultiplier],
  );

  return { reviewMultiplier, load, handleEdit };
}
