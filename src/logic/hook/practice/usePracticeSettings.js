import { useState, useEffect, useCallback } from 'react';

import { getUserSetting, setUserSetting } from '../../../data/local/dao';

import {
  DEFAULT_SETTINGS,
  PRACTICE_MODE_OPTIONS,
  NEW_ORDER_OPTIONS,
  REVIEW_ORDER_OPTIONS,
} from '../../../data/constants';

export function usePracticeSettings() {
  const [settings, setSettings] = useState({
    daily_new_limit: DEFAULT_SETTINGS.daily_new_limit,
    daily_review_limit: DEFAULT_SETTINGS.daily_review_limit,
    daily_total_limit: DEFAULT_SETTINGS.daily_total_limit,
    practice_mode: DEFAULT_SETTINGS.practice_mode,
    new_order: DEFAULT_SETTINGS.new_order,
    review_order: DEFAULT_SETTINGS.review_order,
  });

  useEffect(() => {
    (async () => {
      const keys = Object.keys(settings);
      const entries = await Promise.all(
        keys.map(async key => [key, await getUserSetting(key)]),
      );
      const saved = Object.fromEntries(entries);

      setSettings(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(saved).filter(([, v]) => v != null),
        ),
      }));
    })();
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
      await setUserSetting(key, value);
    } catch (error) {
      console.error(`Update ${key} failed:`, error);
    }
  }, []);

  const getSheetOptions = useCallback(
    type => {
      const numOpts = max =>
        Array.from({ length: max }, (_, i) => (i + 1) * 10);

      const configMap = {
        daily_new_limit: {
          options: numOpts(50),
          onSelect: v => updateSetting('daily_new_limit', v),
        },
        daily_review_limit: {
          options: numOpts(50),
          onSelect: v => updateSetting('daily_review_limit', v),
        },
        daily_total_limit: {
          options: numOpts(50),
          onSelect: v => updateSetting('daily_total_limit', v),
        },
        practice_mode: {
          options: PRACTICE_MODE_OPTIONS.map(o => o.label),
          onSelect: label => {
            const val = PRACTICE_MODE_OPTIONS.find(
              o => o.label === label,
            )?.value;
            updateSetting('practice_mode', val);
          },
        },
        new_order: {
          options: NEW_ORDER_OPTIONS.map(o => o.label),
          onSelect: label => {
            const val = NEW_ORDER_OPTIONS.find(o => o.label === label)?.value;
            updateSetting('new_order', val);
          },
        },
        review_order: {
          options: REVIEW_ORDER_OPTIONS.map(o => o.label),
          onSelect: label => {
            const val = REVIEW_ORDER_OPTIONS.find(
              o => o.label === label,
            )?.value;
            updateSetting('review_order', val);
          },
        },
      };

      return configMap[type] || { options: [], onSelect: null };
    },
    [updateSetting],
  );

  return {
    ...settings,
    getSheetOptions,
  };
}
