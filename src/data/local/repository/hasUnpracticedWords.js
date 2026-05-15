import { eq, and, inArray, sql } from 'drizzle-orm';

import { db, wordBookMapping, wordPracticeStatus } from '../db';

export async function hasUnpracticedWords(bookId) {
  const result = await db
    .select({
      exists: sql`1`,
    })
    .from(wordBookMapping)
    .where(
      and(
        eq(wordBookMapping.bookId, bookId),
        inArray(
          wordBookMapping.word,
          db
            .select({ word: wordPracticeStatus.word })
            .from(wordPracticeStatus)
            .where(eq(wordPracticeStatus.status, 0)),
        ),
      ),
    )
    .limit(1);

  return result.length > 0;
}
