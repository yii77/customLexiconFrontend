import {
  sqliteTable,
  text,
  integer,
  index,
  real,
  unique,
} from 'drizzle-orm/sqlite-core';

// 用户设置
export const userSettings = sqliteTable('user_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
});

// 词书
export const books = sqliteTable('books', {
  id: text('_id').primaryKey(),
  name: text('name').notNull(),
  owner: text('owner'),
  category: text('category'),
  subcategory: text('subcategory'),
  createdAt: text('created_at'),
});

// 笔记本配置
export const notebookSettings = sqliteTable('notebook_settings', {
  bookId: text('book_id')
    .primaryKey()
    .references(() => books.id, { onDelete: 'cascade' }),
  isExpanded: integer('is_expanded').default(0),
  noteOrder: integer('note_order'),
  style: text('style'),
});

// 词书单元
export const unitBookMapping = sqliteTable(
  'unit_book_mapping',
  {
    id: text('_id').primaryKey(),
    bookId: text('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    unitOrder: integer('unit_order').notNull().default(1),
  },
  table => [index('idx_book_units_book_id').on(table.bookId)],
);

// 单词-词书映射
export const wordBookMapping = sqliteTable(
  'word_book_mapping',
  {
    id: text('_id').primaryKey(),
    bookId: text('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    unitId: integer('unit_id').notNull(),
    wordOrder: integer('word_order').notNull(),
    word: text('word').notNull(),
    content: text('content'),
    createAt: text('created_at'),
  },
  table => [
    index('idx_word_book_mapping_book_id').on(table.bookId),
    index('idx_word_book_mapping_unit_id').on(table.unitId),
    index('idx_word_book_mapping_word').on(table.word),
  ],
);

// 单词信息
export const words = sqliteTable(
  'words',
  {
    id: text('_id').primaryKey(),
    word: text('word'),
    definition: text('definition'),
    usPhonetic: text('us_phonetic'),
    ukPhonetic: text('uk_phonetic'),
  },
  table => [index('idx_words_word').on(table.word)],
);

// 单词练习状态
export const wordPracticeStatus = sqliteTable(
  'word_practice_status',
  {
    id: text('_id').primaryKey(),
    word: text('word').notNull().unique(),
    status: integer('status').notNull().default(0),
    starLevel: integer('star_level').notNull().default(3),
    stability: real('stability').notNull().default(0.5),
    difficulty: real('difficulty').notNull().default(5),
    practiceStage: integer('practice_stage').notNull().default(0),
    relearnCount: integer('relearn_count').notNull().default(0),
    nextReviewTime: text('next_review_time'),
  },
  table => [
    index('idx_word_practice_next_review').on(table.nextReviewTime),
    index('idx_word_practice_status').on(table.status),
  ],
);

// 笔记
export const notes = sqliteTable('notes', {
  id: text('_id').primaryKey(),
  mode: text('mode'),
  content: text('content'),
  style: text('style'),
  createdAt: text('created_at'),
});

// 笔记-笔记本关联表
export const noteBookMapping = sqliteTable(
  'note_book_mapping',
  {
    id: text('_id').primaryKey(),
    noteId: text('note_id')
      .notNull()
      .references(() => notes.id, { onDelete: 'cascade' }),
    bookId: text('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
  },
  table => [
    index('idx_note_book_mapping_book_id').on(table.bookId),
    index('idx_note_book_mapping_note_id').on(table.noteId),
  ],
);

// 干扰项
export const distractors = sqliteTable(
  'distractors',
  {
    id: text('_id').primaryKey(),
    wordId: text('word_id'),
    distractorId: text('distractor_id'),
    type: integer('type'),
  },
  table => [index('idx_distractors_word_id').on(table.wordId)],
);

// 每日练习记录
export const dailyPractice = sqliteTable(
  'daily_practice',
  {
    date: text('date').notNull(),
    word: text('word').notNull(),
    type: integer('type').notNull(),
    wrongCount: integer('wrong_count').notNull().default(0),
    fuzzyCount: integer('fuzzy_count').notNull().default(0),
    correctCount: integer('correct_count').notNull().default(0),
    totalStep: integer('total_step').notNull().default(0),
    completedStep: integer('completed_step').notNull().default(0),
    rating: text('rating').default(null),
  },
  table => [
    unique('uq_daily_practice_date_word').on(table.date, table.word),
    index('idx_daily_practice_date').on(table.date),
    index('idx_daily_practice_word_date').on(table.word, table.date),
  ],
);
