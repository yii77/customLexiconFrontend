export const REVIEW_ORDER = {
  TIME: 'time',
  LEAST_REVIEW_FIRST: 'least_review_first',
  MOST_REVIEW_FIRST: 'most_review_first',
  EASY_FIRST: 'easy_first',
  HARD_FIRST: 'hard_first',
  HIGH_ERROR_RATE_FIRST: 'high_error_rate_first',
};

export const REVIEW_ORDER_LABEL = {
  [REVIEW_ORDER.TIME]: '复习时间顺序',
  [REVIEW_ORDER.LEAST_REVIEW_FIRST]: '复习次数少优先',
  [REVIEW_ORDER.MOST_REVIEW_FIRST]: '复习次数多优先',
  [REVIEW_ORDER.EASY_FIRST]: '简单词优先',
  [REVIEW_ORDER.HARD_FIRST]: '困难词优先',
  [REVIEW_ORDER.HIGH_ERROR_RATE_FIRST]: '高错误率优先',
};

export const REVIEW_ORDER_OPTIONS = Object.entries(REVIEW_ORDER_LABEL).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
