import { eq, ne, and, sql } from 'drizzle-orm';

import { db, books, wordBookMapping } from '../db';

export async function getSystemBooks() {
  return await db
    .select({
      _id: books.id,
      name: books.name,
      owner: books.owner,
      category: books.category,
      subcategory: books.subcategory,
      created_at: books.createdAt,
      word_count: sql`
        count(${wordBookMapping.id})
      `.as('word_count'),
    })
    .from(books)
    .leftJoin(wordBookMapping, eq(wordBookMapping.bookId, books.id))
    .where(eq(books.owner, 'system'))
    .groupBy(books.id);
}
