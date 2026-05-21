import { eq, ne, count } from 'drizzle-orm';

import { db, books, wordBookMapping } from '../db';

export const getUserBooks = async () => {
  const result = await db
    .select({
      id: books.id,
      name: books.name,
      owner: books.owner,
      category: books.category,
      subcategory: books.subcategory,
      wordCount: count(wordBookMapping.id),
    })
    .from(books)
    .leftJoin(wordBookMapping, eq(books.id, wordBookMapping.bookId))
    .where(ne(books.owner, 'system'))
    .groupBy(books.id);

  return result;
};
