import { initDatabase } from '../../data/local/db';

import { initializeUserSettings } from '../../data/local/dao';

import { syncPracticeSource } from '.';

export async function initApp() {
  try {
    await initDatabase();
  } catch (error) {
    console.log('数据库初始化失败', error);
    return;
  }

  const results = await Promise.allSettled([
    initializeUserSettings(),
    syncPracticeSource(),
  ]);

  if (results[0].status === 'rejected') {
    console.log('配置项初始化失败', results[0].reason);
  }

  if (results[1].status === 'rejected') {
    console.log('练习资源同步失败', results[1].reason);
  }
}
