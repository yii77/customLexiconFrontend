import { eq, sql } from 'drizzle-orm';

import { db, books } from '../db';

export async function insertBook(data) {
  if (!data) {
    throw new Error('书本信息为空');
  }

  const formatted = {
    id: data._id,
    name: data.name,
    owner: data.owner || null,
    category: data.category || null,
    subcategory: data.subcategory || null,
    createdAt: new Date().toISOString(),
  };

  await db
    .insert(books)
    .values(formatted)
    .onConflictDoUpdate({
      target: books.id,
      set: {
        name: sql`excluded.name`,
        owner: sql`excluded.owner`,
        category: sql`excluded.category`,
        subcategory: sql`excluded.subcategory`,
        createdAt: sql`excluded.created_at`,
      },
    });
}

export async function getBookById(id) {
  return await db.query.books.findFirst({
    where: eq(books.id, id),
  });
}
