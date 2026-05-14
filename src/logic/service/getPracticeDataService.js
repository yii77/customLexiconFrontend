import { getUserSetting } from '../../data/local/dao';

import { PRACTICE_MODE } from '../../data/constants';

export async function getPracticeData({ reviewWords, newWords, practiceMode }) {
  let merged = [];

  const map = {};

  const [brushModes, reviewPlan] = await Promise.all([
    getUserSetting('brush_modes'),
    getUserSetting('review_plan'),
  ]);

  for (const { word, practiceStage, starLevel } of reviewWords ?? []) {
    map[word] = {
      type: 'review',
      flow: getWordPracticeFlow(
        'review',
        brushModes,
        reviewPlan,
        practiceStage ?? 0,
      ),
      practiceStage,
      starLevel,
    };
  }

  switch (practiceMode) {
    case PRACTICE_MODE.REVIEW_ONLY:
      merged = (reviewWords ?? []).map(i => i.word);
      break;

    case PRACTICE_MODE.REVIEW_FIRST: {
      for (const { word, starLevel } of newWords ?? []) {
        map[word] = {
          type: 'new',
          flow: getWordPracticeFlow('new', brushModes, reviewPlan, 0),
          practiceStage: 0,
          starLevel,
        };
      }
      merged = [
        ...(reviewWords ?? []).map(i => i.word),
        ...(newWords ?? []).map(i => i.word),
      ];
      break;
    }

    case PRACTICE_MODE.NEW_FIRST: {
      for (const { word, starLevel } of newWords ?? []) {
        map[word] = {
          type: 'new',
          flow: getWordPracticeFlow('new', brushModes, reviewPlan, 0),
          practiceStage: 0,
          starLevel,
        };
      }
      merged = [
        ...(newWords ?? []).map(i => i.word),
        ...(reviewWords ?? []).map(i => i.word),
      ];
      break;
    }

    case PRACTICE_MODE.MIXED: {
      for (const { word, starLevel } of newWords ?? []) {
        map[word] = {
          type: 'new',
          flow: getWordPracticeFlow('new', brushModes, reviewPlan, 0),
          practiceStage: 0,
          starLevel,
        };
      }

      merged = [
        ...(reviewWords ?? []).map(i => i.word),
        ...(newWords ?? []).map(i => i.word),
      ];

      for (let i = merged.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [merged[i], merged[j]] = [merged[j], merged[i]];
      }
      break;
    }
  }

  return {
    practiceWordArray: merged,
    practiceWordMap: map,
  };
}

function getWordPracticeFlow(type, brush_modes, reviewPlan, practiceStage) {
  const filterValidModes = modeList => {
    return modeList.filter(item => item.value).map(item => item.id);
  };

  if (type === 'new') {
    return ['note', ...brush_modes[0].map(item => item.id)];
  }

  if (type === 'review') {
    const progress = practiceStage / (reviewPlan.length || 1);
    let targetModes = [];

    if (progress < 0.3) {
      targetModes = filterValidModes(brush_modes[0]);
    } else if (progress < 0.7) {
      targetModes = filterValidModes(brush_modes[1]);
    } else {
      targetModes = filterValidModes(brush_modes[2]);
    }

    return targetModes.length ? targetModes : ['enToCn'];
  }

  return ['enToCn'];
}
