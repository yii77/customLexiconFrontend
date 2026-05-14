import { eq, and, lte, isNotNull, count } from 'drizzle-orm';
import { ObjectId } from 'bson';

import { db, wordPracticeStatus } from '../db';

export async function insertWordPracticeStatus(list) {
  const toInsert = list.map(i => ({
    id: new ObjectId().toString(),
    word: i.word,
  }));

  await db.insert(wordPracticeStatus).values(toInsert).onConflictDoNothing();
}

export async function getTodayReviewCount() {
  const endOfDay = new Date();

  endOfDay.setHours(23, 59, 59, 999);

  const endOfDayString = endOfDay.toISOString();

  const result = await db
    .select({
      count: count(),
    })
    .from(wordPracticeStatus)
    .where(
      and(
        isNotNull(wordPracticeStatus.nextReviewTime),
        lte(wordPracticeStatus.nextReviewTime, endOfDayString),
      ),
    );

  return result[0]?.count ?? 0;
}

export async function getDueReviewWords(orderBy, limit) {
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayEndStr = todayEnd.toISOString();

  const query = db
    .select({
      word: wordPracticeStatus.word,
      practiceStage: wordPracticeStatus.practiceStage,
      starLevel: wordPracticeStatus.starLevel,
    })
    .from(wordPracticeStatus)
    .where(
      and(
        isNotNull(wordPracticeStatus.nextReviewTime),
        lte(wordPracticeStatus.nextReviewTime, todayEndStr),
      ),
    )
    .orderBy(...orderBy);

  if (limit !== undefined) {
    query.limit(limit);
  }

  return query;
}

export async function updateWordPracticeStatus(
  word,
  status,
  practiceStage,
  nextReviewTime,
) {
  await db
    .update(wordPracticeStatus)
    .set({
      status,
      practiceStage,
      nextReviewTime,
    })
    .where(eq(wordPracticeStatus.word, word));
}

export async function updateWordStarLevel(word, starLevel) {
  await db
    .update(wordPracticeStatus)
    .set({ starLevel })
    .where(eq(wordPracticeStatus.word, word));
}
