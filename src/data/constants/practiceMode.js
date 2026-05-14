export const PRACTICE_MODE = {
  MIXED: 'mixed',
  NEW_FIRST: 'new_first',
  REVIEW_FIRST: 'review_first',
  REVIEW_ONLY: 'review_only',
};

export const PRACTICE_MODE_LABEL = {
  [PRACTICE_MODE.MIXED]: '混合模式',
  [PRACTICE_MODE.NEW_FIRST]: '先学新词',
  [PRACTICE_MODE.REVIEW_FIRST]: '优先复习',
  [PRACTICE_MODE.REVIEW_ONLY]: '只复习',
};

export const PRACTICE_MODE_OPTIONS = Object.entries(PRACTICE_MODE_LABEL).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
