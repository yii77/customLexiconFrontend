export async function createTables(sqlite) {
  sqlite.execute('PRAGMA foreign_keys = ON;');

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS user_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS books (
        _id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        owner TEXT,
        category TEXT,
        subcategory TEXT,
        created_at TEXT
      );
    `);

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS notebook_settings (
        book_id TEXT PRIMARY KEY,
        is_expanded INTEGER DEFAULT 0,
        note_order INTEGER,
        style TEXT,
        FOREIGN KEY (book_id) REFERENCES books(_id) ON DELETE CASCADE
      );
    `);

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS unit_book_mapping (
        _id TEXT PRIMARY KEY ,
        book_id TEXT NOT NULL,
        name TEXT NOT NULL,
        unit_order INTEGER NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(_id) ON DELETE CASCADE
      );
    `);

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_unit_book_mapping_book_id ON unit_book_mapping(book_id);`,
  );

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS word_book_mapping (
        _id TEXT PRIMARY KEY ,
        book_id TEXT NOT NULL,
        unit_id TEXT NOT NULL,
        word_order INTEGER NOT NULL,
        word TEXT NOT NULL,
        content TEXT,
        created_at TEXT,
        FOREIGN KEY (book_id) REFERENCES books(_id) ON DELETE CASCADE
      );
    `);

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_word_book_mapping_book_id ON word_book_mapping(book_id);`,
  );

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_word_book_mapping_unit_id ON word_book_mapping(unit_id);`,
  );

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_word_book_mapping_word ON word_book_mapping(word);`,
  );

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS words (
        _id TEXT PRIMARY KEY,
        word TEXT,
        definition TEXT,
        us_phonetic TEXT,
        uk_phonetic TEXT
      );
    `);

  sqlite.execute(`CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);`);

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS word_practice_status (
        _id TEXT PRIMARY KEY,
        word TEXT NOT NULL UNIQUE,
        status INTEGER NOT NULL DEFAULT 0,
        star_level INTEGER NOT NULL DEFAULT 3,
        stability REAL NOT NULL DEFAULT 0.5,
        difficulty REAL NOT NULL DEFAULT 5,
        practice_stage INTEGER DEFAULT 0,
        relearn_count INTEGER NOT NULL DEFAULT 0,
        next_review_time TEXT
      );
    `);

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_word_practice_next_review ON word_practice_status(next_review_time);`,
  );

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_word_practice_status ON word_practice_status(status);`,
  );

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        _id TEXT PRIMARY KEY ,
        mode TEXT,
        content TEXT,
        style TEXT,
        created_at TEXT
      );
    `);

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS note_book_mapping (
        _id TEXT PRIMARY KEY ,
        note_id TEXT NOT NULL,
        book_id TEXT NOT NULL,
        FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(_id) ON DELETE CASCADE
      );
    `);

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_note_book_mapping_book_id ON note_book_mapping(book_id);`,
  );

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_note_book_mapping_note_id ON note_book_mapping(note_id);`,
  );

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS distractors (
        _id TEXT PRIMARY KEY,
        word_id TEXT,
        distractor_id TEXT,
        type INTEGER
      );
    `);

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_distractors_word_id ON distractors(word_id);`,
  );

  sqlite.execute(`
      CREATE TABLE IF NOT EXISTS daily_practice (
      date TEXT NOT NULL,
      word TEXT NOT NULL,
      type INTEGER NOT NULL,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      fuzzy_count INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      total_step INTEGER NOT NULL DEFAULT 0,
      completed_step INTEGER NOT NULL DEFAULT 0,
      rating TEXT DEFAULT NULL,
      PRIMARY KEY (date, word)
    );
  `);

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_daily_practice_date ON daily_practice(date);`,
  );

  sqlite.execute(
    `CREATE INDEX IF NOT EXISTS idx_daily_practice_word_date ON daily_practice(word, date);`,
  );
}
