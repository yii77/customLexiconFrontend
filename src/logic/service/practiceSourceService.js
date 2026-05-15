import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  fetchDistractorDownload,
  fetchDistractorVersion,
  fetchWordDownload,
  fetchWordVersion,
} from '../../data/api';

import {
  clearDistractors,
  clearWords,
  insertDistractors,
  insertWords,
} from '../../data/local/dao';

const PRACTICE_SOURCE_VERSION_KEYS = {
  distractor: 'practice_source_distractor_version',
  word: 'practice_source_word_version',
};

export async function syncPracticeSource() {
  await Promise.all([syncDistractorSource(), syncWordSource()]);
}

export async function syncDistractorSource() {
  const localVersion = await AsyncStorage.getItem(
    PRACTICE_SOURCE_VERSION_KEYS.distractor,
  );

  const versionRes = await fetchDistractorVersion();
  const serverVersion = getServerVersion(versionRes);

  if (localVersion === serverVersion) {
    console.log('干扰项资源无需更新');
    return;
  }

  const list = await fetchDistractorDownload();

  if (!list) {
    throw new Error({ detail: '获取干扰项资源失败' });
  }

  await clearDistractors();
  if (list.length > 0) {
    await insertDistractors(list);
  }

  await AsyncStorage.setItem(
    PRACTICE_SOURCE_VERSION_KEYS.distractor,
    serverVersion,
  );

  console.log('干扰项资源更新完成');
}

export async function syncWordSource() {
  const localVersion = await AsyncStorage.getItem(
    PRACTICE_SOURCE_VERSION_KEYS.word,
  );

  const versionRes = await fetchWordVersion();
  const serverVersion = getServerVersion(versionRes);

  if (localVersion === serverVersion) {
    console.log('单词资源无需更新');
    return;
  }

  const list = await fetchWordDownload();

  if (!list) {
    throw new Error({ detail: '获取单词资源失败' });
  }

  await clearWords();
  if (list.length > 0) {
    await insertWords(list);
  }
  await AsyncStorage.setItem(PRACTICE_SOURCE_VERSION_KEYS.word, serverVersion);

  console.log('单词资源更新完成');
}

function getServerVersion(res) {
  if (!res?.success) throw new Error({ detail: '获取练习资源版本失败' });

  const version = res.data;

  if (!version) {
    throw new Error({ detail: '获取练习资源版本失败' });
  }

  return version == null ? null : String(version);
}
