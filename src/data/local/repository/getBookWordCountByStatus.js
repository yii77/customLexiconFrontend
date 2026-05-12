import { eq } from 'drizzle-orm';

import { db, wordBookMapping, wordPracticeStatus } from '../db';

export async function getBookWordCountByStatus(bookId) {
  const rows = await db
    .select({
      word: wordBookMapping.word,
      status: wordPracticeStatus.status,
    })
    .from(wordBookMapping)
    .leftJoin(
      wordPracticeStatus,
      eq(wordBookMapping.word, wordPracticeStatus.word),
    )
    .where(eq(wordBookMapping.bookId, bookId));

  const count = [0, 0, 0];

  for (const row of rows) {
    const status = row.status ?? 0;
    count[status]++;
  }

  return count;
}
