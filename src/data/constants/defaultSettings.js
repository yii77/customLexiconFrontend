export const DEFAULT_SETTINGS = {
  // ============================ 练习配置 ============================
  daily_new_limit: 20, // 每天学习上限
  daily_review_limit: 100, // 每天复习上限
  daily_total_limit: 100, // 每天练习总上限
  practice_mode: 'review_first', // 记忆模式：混合模式 / 先学新词 / 优先复习 / 只复习
  new_order: 'book', // 学习顺序：书籍正序 / 字母正序 / 书籍随机 / 字母随机
  review_order: 'time', // 复习顺序：时间 / 复习次数少的优先 / 复习次数多的优先 / 容易的优先 / 难的优先 / 错误率高的优先
  review_plan: [1, 2, 4, 7, 15, 30, 60, 120], // 间隔天数
  review_multiplier: [1.4, 1.2, 1, 0.8, 0.6], // 分数倍率
  brush_modes: [
    [
      { id: 'enToCn', value: true },
      { id: 'cnToEn', value: true },
      { id: 'spelling', value: false },
      { id: 'recall', value: true },
    ],
    [
      { id: 'spelling', value: true },
      { id: 'enToCn', value: false },
      { id: 'cnToEn', value: false },
      { id: 'recall', value: true },
    ],
    [
      { id: 'spelling', value: false },
      { id: 'enToCn', value: false },
      { id: 'cnToEn', value: false },
      { id: 'recall', value: true },
    ],
  ], // 前中后期刷词模式
  brush_gesture_actions: {
    swipe_up: null, // 上滑行为
    swipe_down: null, // 下滑
    swipe_left: null, // 左滑
    swipe_right: null, // 右滑
  }, // 刷词卡片手势
  desired_retention: 0.85, // 目标记忆保持率

  // ============================ 字体 / 主题配置 ============================
  english_font: 'Merriweather', // 英文学习字体
  chinese_font: '思源宋体', // 中文学习字体

  // ============================ 词书单词浏览配置 ============================
  list_display_order: 'book_order', // 默认用词书顺序
  list_default_expand: true, // 默认展开

  // ============================ 笔记默认配置 ============================
  show_definition: true, // 默认显示释义
  definition_style_type: 'posPick', // 默认释义卡片类型
  note_display_type: 'row', // 默认笔记展示模式
  note_default_style: {
    show_label: false,
    default_hidden: false,
    toggle_visible: false,
    font_family: 'Merriweather',
    font_size: '14',
    font_weight: 'Regular',
    font_color: '#212121',
    background_color: '#FFFFFF00',
    italic: false,
    next_col: '空格',
  }, // 默认笔记样式

  default_phonetic: 1, // 默认发音
};
