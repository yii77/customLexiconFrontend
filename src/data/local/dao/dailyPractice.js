import { and, eq, count, sql, inArray } from 'drizzle-orm';

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

export async function getWordErrorList() {
  const countExpr = sql`
    SUM(${dailyPractice.wrongCount})
    + SUM(${dailyPractice.fuzzyCount}) * 0.5
  `;

  const result = await db
    .select({
      word: dailyPractice.word,
    })
    .from(dailyPractice)
    .groupBy(dailyPractice.word)
    .having(sql`${countExpr} > 0`);

  return result.map(r => r.word);
}

export async function getTodayPracticeStats() {
  const today = new Date().toISOString().slice(0, 10);

  const result = await db
    .select({
      word: dailyPractice.word,
      wrongCount: sql`SUM(${dailyPractice.wrongCount})`.as('wrongCount'),
    })
    .from(dailyPractice)
    .where(eq(dailyPractice.date, today))
    .groupBy(dailyPractice.word);

  return result;
}

export async function getTodayWords() {
  const today = new Date().toISOString().slice(0, 10);

  const result = await db
    .select({
      word: dailyPractice.word,
    })
    .from(dailyPractice)
    .where(eq(dailyPractice.date, today));

  return result.map(item => item.word);
}
