import { eq, sql } from 'drizzle-orm';

import { db, wordBookMapping } from '../db';

export async function insertWordBookMappings(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('数据为空');
  }

  const formatted = data.map(item => ({
    id: item._id,
    bookId: item.book_id,
    unitId: item.unit_id,
    wordOrder: item.word_order,
    word: item.word,
    content: item.content ? JSON.stringify(item.content) : null,
    createTime: new Date().toISOString(),
  }));

  await db
    .insert(wordBookMapping)
    .values(formatted)
    .onConflictDoUpdate({
      target: wordBookMapping.id,
      set: {
        word: sql`excluded.word`,
        content: sql`excluded.content`,
        wordOrder: sql`excluded.word_order`,
      },
    });
}
