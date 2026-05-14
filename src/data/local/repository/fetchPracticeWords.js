import { eq, and, sql, asc, desc } from 'drizzle-orm';

import { db, wordBookMapping, wordPracticeStatus } from '../db';

import { getDueReviewWords, getUserSetting } from '../dao';

export async function fetchPracticeWords({ newCount, reviewCount, bookId }) {
  if (reviewCount === 0 && newCount === 0) return;
  let reviewWords = [];
  let newWords = [];
  const [newOrder, reviewOrder] = await Promise.all([
    getUserSetting('new_order'),
    getUserSetting('review_order'),
  ]);

  if (reviewCount != 0) {
    reviewWords = await getDueReviewWords(
      reviewSortOptions[reviewOrder],
      reviewCount,
    );
  }
  if (newCount != 0) {
    newWords = await getNewWords(bookId, newOrder, newCount);
  }
  return {
    newWords,
    reviewWords,
  };
}

const reviewSortOptions = {
  time: [asc(wordPracticeStatus.nextReviewTime)], // 复习时间顺序

  least_review_first: [
    asc(wordPracticeStatus.reviewCount),
    asc(wordPracticeStatus.nextReviewTime),
  ], // 复习次数少的优先

  most_review_first: [
    desc(wordPracticeStatus.reviewCount),
    asc(wordPracticeStatus.nextReviewTime),
  ], // 复习次数多的优先

  easy_first: [
    asc(wordPracticeStatus.starLevel),
    asc(wordPracticeStatus.nextReviewTime),
  ], // 星级小的优先（简单词优先）

  hard_first: [
    desc(wordPracticeStatus.starLevel),
    asc(wordPracticeStatus.nextReviewTime),
  ], // 星级大的优先（难词优先）

  high_error_rate_first: [
    desc(
      sql`CASE 
        WHEN (${wordPracticeStatus.correctCount} + ${wordPracticeStatus.fuzzyCount} + ${wordPracticeStatus.wrongCount}) = 0 
        THEN 0 
        ELSE CAST(${wordPracticeStatus.wrongCount} AS REAL) / (${wordPracticeStatus.correctCount} + ${wordPracticeStatus.fuzzyCount} + ${wordPracticeStatus.wrongCount})
      END`,
    ),
    asc(wordPracticeStatus.nextReviewTime),
  ], // 错误率高的优先
};

async function getNewWords(bookId, order, limit) {
  // book 顺序
  if (order === 'book') {
    return db
      .select({
        word: wordBookMapping.word,
        starLevel: wordPracticeStatus.starLevel,
      })
      .from(wordBookMapping)
      .innerJoin(
        wordPracticeStatus,
        eq(wordBookMapping.word, wordPracticeStatus.word),
      )
      .where(
        and(
          eq(wordBookMapping.bookId, bookId),
          eq(wordPracticeStatus.status, 0),
        ),
      )
      .orderBy(asc(wordBookMapping.wordOrder))
      .limit(limit);
  }

  // 字母顺序
  if (order === 'alphabet') {
    return db
      .select({
        word: wordBookMapping.word,
        starLevel: wordPracticeStatus.starLevel,
      })
      .from(wordBookMapping)
      .innerJoin(
        wordPracticeStatus,
        eq(wordBookMapping.word, wordPracticeStatus.word),
      )
      .where(
        and(
          eq(wordBookMapping.bookId, bookId),
          eq(wordPracticeStatus.status, 0),
        ),
      )
      .orderBy(asc(wordBookMapping.word))
      .limit(limit);
  }

  // book 顺序选出后打乱
  if (order === 'book_random') {
    const rows = await db
      .select({
        word: wordBookMapping.word,
        starLevel: wordPracticeStatus.starLevel,
      })
      .from(wordBookMapping)
      .innerJoin(
        wordPracticeStatus,
        eq(wordBookMapping.word, wordPracticeStatus.word),
      )
      .where(
        and(
          eq(wordBookMapping.bookId, bookId),
          eq(wordPracticeStatus.status, 0),
        ),
      )
      .orderBy(asc(wordBookMapping.wordOrder))
      .limit(limit);

    return rows.sort(() => Math.random() - 0.5);
  }

  // 字母顺序选出后打乱
  if (order === 'alphabet_random') {
    const rows = await db
      .select({
        word: wordBookMapping.word,
        starLevel: wordPracticeStatus.starLevel,
      })
      .from(wordBookMapping)
      .innerJoin(
        wordPracticeStatus,
        eq(wordBookMapping.word, wordPracticeStatus.word),
      )
      .where(
        and(
          eq(wordBookMapping.bookId, bookId),
          eq(wordPracticeStatus.status, 0),
        ),
      )
      .orderBy(asc(wordBookMapping.word))
      .limit(limit);

    return rows.sort(() => Math.random() - 0.5);
  }
}
