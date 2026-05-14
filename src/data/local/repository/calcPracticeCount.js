import { eq, count } from 'drizzle-orm';

import { db, wordBookMapping, wordPracticeStatus } from '../db';

import {
  getUserSetting,
  getTodayCompletedCount,
  getTodayReviewCount,
} from '../dao';

export async function calcPracticeCount(reviewOnly) {
  const [
    initialNewLimit,
    initialReviewLimit,
    initialTotalLimit,
    todayCompleted,
    baseNeedReview,
  ] = await Promise.all([
    getUserSetting('daily_new_limit'),
    getUserSetting('daily_review_limit'),
    getUserSetting('daily_total_limit'),
    getTodayCompletedCount(),
    getTodayReviewCount(),
  ]);

  const completedCount =
    todayCompleted.completedNewCount + todayCompleted.completedReviewCount;
  const remainingNewLimit = initialNewLimit - todayCompleted.completedNewCount;
  const remainingReviewLimit =
    initialReviewLimit - todayCompleted.completedReviewCount;
  const remainingTotalLimit = initialTotalLimit - completedCount;

  const finalReviewCount = Math.min(baseNeedReview, remainingReviewLimit);
  let finalNewCount = 0;

  if (!reviewOnly) {
    finalNewCount = await getNewWordAvailableCount(
      Math.min(remainingNewLimit, remainingTotalLimit - finalReviewCount),
    );
  }

  return {
    newCount: finalNewCount,
    reviewCount: finalReviewCount,
    completedCount,
  };
}

export async function getNewWordAvailableCount(limitCount) {
  const result = await db
    .select({ count: count() })
    .from(wordPracticeStatus)
    .innerJoin(
      wordBookMapping,
      eq(wordPracticeStatus.word, wordBookMapping.word),
    )
    .where(eq(wordPracticeStatus.status, 0));

  const availableCount = result[0]?.count || 0;

  return Math.min(availableCount, limitCount);
}
