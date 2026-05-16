export const NEW_ORDER = {
  BOOK: 'book',
  ALPHABET: 'alphabet',
  BOOK_RANDOM: 'book_random',
  ALPHABET_RANDOM: 'alphabet_random',
};

export const NEW_ORDER_LABEL = {
  [NEW_ORDER.BOOK]: '词书顺序',
  [NEW_ORDER.BOOK_RANDOM]: '词书顺序（随机）',
  [NEW_ORDER.ALPHABET]: '字母顺序',
  [NEW_ORDER.ALPHABET_RANDOM]: '字母顺序（随机）',
};

export const NEW_ORDER_OPTIONS = Object.entries(NEW_ORDER_LABEL).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
