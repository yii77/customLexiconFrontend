import { eq, sql, and, count } from 'drizzle-orm';

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
    createAt: new Date().toISOString(),
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

export async function updateWordOrders(bookId, changed) {
  await Promise.all(
    changed.map(({ word, wordOrder }) =>
      db
        .update(wordBookMapping)
        .set({ wordOrder })
        .where(
          and(
            eq(wordBookMapping.word, word),
            eq(wordBookMapping.bookId, bookId),
          ),
        ),
    ),
  );
}

export const getWordCountByBookId = async bookId => {
  const result = await db
    .select({
      count: count(wordBookMapping.id),
    })
    .from(wordBookMapping)
    .where(eq(wordBookMapping.bookId, bookId));

  return result[0]?.count ?? 0;
};
