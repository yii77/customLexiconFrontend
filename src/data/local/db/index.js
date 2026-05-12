import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';

import * as schema from './schema';

import { createTables } from './tables';

const sqlite = open({ name: 'lexicon.db' });

export const db = drizzle(sqlite, { schema });

export async function initDatabase() {
  await createTables(sqlite);
}

export * from './schema';
