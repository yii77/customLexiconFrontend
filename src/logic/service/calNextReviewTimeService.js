import {
  getWordPracticeByDate,
  updateWordPracticeStatus,
  getUserSetting,
} from '../../data/local/dao';

export async function calNextReviewTime(word, practiceStage, starLevel) {
  const today = new Date();
  const date = today.toISOString().slice(0, 10);

  const [reviewPlan, reviewMultiplier, { wrongCount, fuzzyCount, totalStep }] =
    await Promise.all([
      getUserSetting('review_plan'),
      getUserSetting('review_multiplier'),
      getWordPracticeByDate(word, date),
    ]);

  let nextPracticeStage = 0;

  const overRate = (wrongCount + fuzzyCount / 2) / totalStep;

  if (overRate <= 0.4) {
    nextPracticeStage = practiceStage + 1;
  } else if (overRate <= 0.6) {
    nextPracticeStage = practiceStage;
  } else {
    nextPracticeStage = Math.max(0, practiceStage - 1);
  }

  if (nextPracticeStage === 0) {
    updateWordPracticeStatus(word, 0, 0, null);
  } else {
    if (reviewPlan.length < nextPracticeStage) {
      updateWordPracticeStatus(word, 2, reviewPlan.length, null);
    } else {
      const interval =
        (reviewPlan[nextPracticeStage] - reviewPlan[nextPracticeStage - 1]) *
        reviewMultiplier[starLevel - 1];

      const nextReviewTime = new Date(
        today.getTime() + interval * 24 * 60 * 60 * 1000,
      ).toISOString();

      updateWordPracticeStatus(word, 1, nextPracticeStage, nextReviewTime);
    }
  }
}
