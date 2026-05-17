export const DISPLAY_ORDER = {
  WORD_ORDER: 'word_order',
  UNIT: 'unit',
  ALPHABET: 'alphabet',
  CREATE_TIME_ASC: 'create_time_asc',
  CREATE_TIME_DESC: 'create_time_desc',
};

export const DISPLAY_ORDER_LABEL = {
  [DISPLAY_ORDER.WORD_ORDER]: '按单词顺序',
  [DISPLAY_ORDER.UNIT]: '按词书单元',
  [DISPLAY_ORDER.ALPHABET]: '按字母顺序',
  [DISPLAY_ORDER.CREATE_TIME_ASC]: '按时间正序',
  [DISPLAY_ORDER.CREATE_TIME_DESC]: '按时间倒序',
};

export const DISPLAY_ORDER_OPTIONS = Object.entries(DISPLAY_ORDER_LABEL).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
