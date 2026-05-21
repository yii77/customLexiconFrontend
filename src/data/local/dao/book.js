import { eq, sql, ne, and } from 'drizzle-orm';
import { ObjectId } from 'bson';

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

export async function getSubcategoryOptions(category) {
  const result = await db
    .selectDistinct({
      subcategory: books.subcategory,
    })
    .from(books)
    .where(and(eq(books.category, category), ne(books.owner, 'system')));

  return result.map(item => item.subcategory).filter(Boolean);
}

export async function checkBookExists(name, category, subcategory) {
  const result = await db
    .select({ id: books.id })
    .from(books)
    .where(
      and(
        eq(books.name, name),
        eq(books.category, category),
        eq(books.subcategory, subcategory),
        ne(books.owner, 'system'),
      ),
    )
    .limit(1);

  return result.length > 0;
}

export async function insertWordBook(name, subcategory) {
  const book = {
    id: new ObjectId().toString(),
    name: name.trim(),
    owner: 'user',
    category: '单词本',
    subcategory: subcategory?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  await db.insert(books).values(book);
}

export async function updateBook(id, name, subcategory) {
  await db
    .update(books)
    .set({
      name: name,
      subcategory: subcategory?.trim() || null,
    })
    .where(eq(books.id, id));
}

export async function deleteBook(id) {
  await db.delete(books).where(eq(books.id, id));
}
