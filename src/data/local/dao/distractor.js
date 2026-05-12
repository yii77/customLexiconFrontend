import { sql } from 'drizzle-orm';

import { db, distractors } from '../db';

const INSERT_BATCH_SIZE = 5000;

export async function insertDistractors(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('数据为空');
  }

  const formatted = data.map(item => ({
    id: item._id,
    wordId: item.word_id,
    distractorId: item.distractor_id,
    type: item.type,
  }));

  const chunk = (list, size) => {
    const result = [];

    for (let index = 0; index < list.length; index += size) {
      result.push(list.slice(index, index + size));
    }

    return result;
  };

  for (const batch of chunk(formatted, INSERT_BATCH_SIZE)) {
    await db
      .insert(distractors)
      .values(batch)
      .onConflictDoUpdate({
        target: distractors.id,
        set: {
          wordId: sql`excluded.word_id`,
          distractorId: sql`excluded.distractor_id`,
          type: sql`excluded.type`,
        },
      });
  }
}

export async function clearDistractors() {
  await db.delete(distractors);
}
