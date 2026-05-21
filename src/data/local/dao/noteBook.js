import { ObjectId } from 'bson';
import { sql } from 'drizzle-orm';

import { db, books, notebookSettings } from '../db';

export async function insertNotebook(name, subcategory) {
  const bookId = new ObjectId().toString();

  await db.transaction(async tx => {
    const [maxOrder] = await tx
      .select({
        value: sql`COALESCE(MAX(note_order), 0)`,
      })
      .from(notebookSettings);

    const nextOrder = Number(maxOrder?.value ?? 0) + 1;

    await tx.insert(books).values({
      id: bookId,
      name,
      owner: 'user',
      category: '笔记本',
      subcategory: subcategory?.trim() || null,
      createdAt: new Date().toISOString(),
    });

    await tx.insert(notebookSettings).values({
      bookId,
      isExpanded: 0,
      noteOrder: nextOrder,
      style: null,
    });
  });
}
