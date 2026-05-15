import { eq, sql } from 'drizzle-orm';
import { db, distractors, words } from '../db';

export async function getWordWithDistractors(word) {
  if (!word) return null;

  const mainResult = await db
    .select({
      id: words.id,
      word: words.word,
      definition: words.definition,
    })
    .from(words)
    .where(eq(words.word, word))
    .limit(1);

  const main = mainResult[0];

  if (!main) return null;

  const distractorList = await db
    .select({
      word: words.word,
      definition: words.definition,
      type: distractors.type,
    })
    .from(distractors)
    .leftJoin(words, eq(distractors.distractorId, words.id))
    .where(eq(distractors.wordId, main.id))
    .orderBy(sql`RANDOM()`)
    .limit(3);

  return {
    ...main,
    definition: main.definition,
    distractors: distractorList ?? [],
  };
}
