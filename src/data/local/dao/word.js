import { sql } from 'drizzle-orm';

import { db, words } from '../db';

const INSERT_BATCH_SIZE = 5000;

export async function insertWords(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('数据为空');
  }

  const formatted = data.map(item => ({
    id: item._id,
    word: item.word,
    definition: item.definition ? JSON.stringify(item.definition) : null,
    usPhonetic: item.us_phonetic || null,
    ukPhonetic: item.uk_phonetic || null,
  }));

  const chunk = (list, size) => {
    const result = [];

    for (let index = 0; index < list.length; index += size) {
      result.push(list.slice(index, index + size));
    }

    return result;
  };

  for (const batch of chunk(formatted, INSERT_BATCH_SIZE)) {
    await db
      .insert(words)
      .values(batch)
      .onConflictDoUpdate({
        target: words.id,
        set: {
          word: sql`excluded.word`,
          definition: sql`excluded.definition`,
          usPhonetic: sql`excluded.us_phonetic`,
          ukPhonetic: sql`excluded.uk_phonetic`,
        },
      });
  }
}

export async function clearWords() {
  await db.delete(words);
}
