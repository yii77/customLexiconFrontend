export const BRUSH_MODE = {
  EN_TO_CN: 'enToCn',
  CN_TO_EN: 'cnToEn',
  SPELLING: 'spelling',
  RECALL: 'recall',
};

export const BRUSH_MODE_LABEL = {
  [BRUSH_MODE.EN_TO_CN]: '英文选中',
  [BRUSH_MODE.CN_TO_EN]: '中文选英',
  [BRUSH_MODE.SPELLING]: '单词拼写',
  [BRUSH_MODE.RECALL]: '回忆模式',
};

export const BRUSH_MODE_OPTIONS = Object.entries(BRUSH_MODE_LABEL).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
