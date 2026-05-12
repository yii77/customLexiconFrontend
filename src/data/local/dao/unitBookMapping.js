import { sql } from 'drizzle-orm';

import { db, unitBookMapping } from '../db';

export async function insertUnitBookMappings(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const formatted = data.map(item => ({
    id: item._id,
    bookId: item.book_id,
    name: item.name,
    unitOrder: item.unit_order ?? 1,
  }));

  await db
    .insert(unitBookMapping)
    .values(formatted)
    .onConflictDoUpdate({
      target: unitBookMapping.id,
      set: {
        name: sql`excluded.name`,
        unitOrder: sql`excluded.unit_order`,
      },
    });
}
