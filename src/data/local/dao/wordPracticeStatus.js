import { ObjectId } from 'bson';

import { db, wordPracticeStatus } from '../db';

export async function insertWordPracticeStatus(list) {
  const toInsert = list.map(i => ({
    id: new ObjectId().toString(),
    word: i.word,
  }));

  await db.insert(wordPracticeStatus).values(toInsert).onConflictDoNothing();
}
