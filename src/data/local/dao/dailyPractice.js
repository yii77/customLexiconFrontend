import { and, eq, count, sql } from 'drizzle-orm';

import { db, dailyPractice } from '../db';

export async function getTodayCompletedCount() {
  const now = new Date();

  const today = now.toISOString().slice(0, 10);

  const result = await db
    .select({
      type: dailyPractice.type,
      count: count(),
    })
    .from(dailyPractice)
    .where(
      and(
        eq(dailyPractice.date, today),
        eq(dailyPractice.totalStep, dailyPractice.completedStep),
      ),
    )
    .groupBy(dailyPractice.type);

  let completedNewCount = 0;
  let completedReviewCount = 0;

  for (const item of result) {
    if (item.type === 'new') {
      completedNewCount = item.count;
    }

    if (item.type === 'review') {
      completedReviewCount = item.count;
    }
  }

  return {
    completedNewCount,
    completedReviewCount,
  };
}

export async function getCompletedStep(word, date) {
  const result = await db
    .select({
      completedStep: dailyPractice.completedStep,
    })
    .from(dailyPractice)
    .where(and(eq(dailyPractice.word, word), eq(dailyPractice.date, date)))
    .limit(1);

  return result.length > 0 ? result[0].completedStep : 0;
}

export async function incrementDailyPractice(
  word,
  date,
  type,
  totalStep,
  field,
  completedStep,
) {
  const fieldMap = {
    wrong: dailyPractice.wrongCount,
    fuzzy: dailyPractice.fuzzyCount,
    correct: dailyPractice.correctCount,
  };

  const insertFieldMap = {
    wrong: 'wrongCount',
    fuzzy: 'fuzzyCount',
    correct: 'correctCount',
  };

  const targetField = fieldMap[field];
  const insertField = insertFieldMap[field];

  await db
    .insert(dailyPractice)
    .values({
      word,
      date,
      type,
      totalStep,
      completedStep,
      wrongCount: 0,
      fuzzyCount: 0,
      correctCount: 0,
      [insertField]: 1,
    })
    .onConflictDoUpdate({
      target: [dailyPractice.word, dailyPractice.date],
      set: {
        type,
        totalStep,
        completedStep,
        [insertField]: sql`${targetField} + 1`,
      },
    });
}

export async function getWordPracticeByDate(word, date) {
  const result = await db
    .select()
    .from(dailyPractice)
    .where(and(eq(dailyPractice.date, date), eq(dailyPractice.word, word)))
    .limit(1);

  return result[0] || null;
}
