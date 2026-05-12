import { eq, ne, and, sql } from 'drizzle-orm';

import { db, books, wordBookMapping } from '../db';

export async function getUserWordBooks() {
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
    .where(and(ne(books.owner, 'system'), eq(books.category, '单词本')))
    .groupBy(books.id);
}
