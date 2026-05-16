import { useState, useCallback } from 'react';

import { getUserSetting, setUserSetting } from '../../../data/local/dao';

import { DEFAULT_SETTINGS } from '../../../data/constants';

import { useCustomAlert } from '../../../presentation/component/system';

export function useReviewPlan() {
  const [reviewPlan, setReviewPlan] = useState(DEFAULT_SETTINGS.review_plan);

  const { showAlert, hideAlert } = useCustomAlert();

  const load = useCallback(async () => {
    const plan = await getUserSetting('review_plan');
    if (plan) setReviewPlan(plan);
  }, []);

  const save = useCallback(next => {
    setReviewPlan(next);
    setUserSetting('review_plan', next);
  }, []);

  const handleAdd = useCallback(
    val => {
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
        return;
      }

      if (reviewPlan.includes(num)) {
        showAlert({
          title: '提示',
          content: '该天已有复习计划',
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

      const next = [...reviewPlan, num];

      save(next.sort((a, b) => a - b));

      return { success: true };
    },
    [reviewPlan, save],
  );

  const handleRemove = useCallback(
    index => {
      showAlert({
        title: '注意',
        content: '是否删除该天的复习计划？',
        buttons: [
          {
            text: '取消',
            onPress: hideAlert,
          },
          {
            text: '确定',
            onPress: () => {
              save(reviewPlan.filter((_, i) => i !== index));
              hideAlert();
            },
          },
        ],
        type: 'center',
      });
      return;
    },
    [reviewPlan, save],
  );

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
        return;
      }
      if (reviewPlan.includes(num) && reviewPlan[index] !== num) {
        showAlert({
          title: '提示',
          content: '该天已有复习计划',
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
      const next = [...reviewPlan];
      next[index] = num;
      save(next.sort((a, b) => a - b));
      return { success: true };
    },
    [reviewPlan, save],
  );

  return { reviewPlan, load, handleAdd, handleRemove, handleEdit };
}
