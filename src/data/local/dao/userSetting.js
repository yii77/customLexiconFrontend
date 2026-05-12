import { eq, notInArray } from 'drizzle-orm';

import { db, userSettings } from '../db';

import { DEFAULT_SETTINGS } from '../../constants';

export async function initializeUserSettings() {
  const settings = await db.select().from(userSettings);

  const dbKeys = new Set(settings.map(item => item.key));

  const insertList = Object.entries(DEFAULT_SETTINGS)
    .filter(([key]) => !dbKeys.has(key))
    .map(([key, value]) => ({
      key,
      value: JSON.stringify(value),
    }));

  if (insertList.length) {
    await db.insert(userSettings).values(insertList);
  }

  await db
    .delete(userSettings)
    .where(notInArray(userSettings.key, Object.keys(DEFAULT_SETTINGS)));
}

export async function getUserSetting(key) {
  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.key, key))
    .limit(1);

  if (result.length === 0) return null;

  return JSON.parse(result[0].value);
}

export async function setUserSetting(key, value) {
  await db
    .update(userSettings)
    .set({
      value: JSON.stringify(value),
    })
    .where(eq(userSettings.key, key));
}
