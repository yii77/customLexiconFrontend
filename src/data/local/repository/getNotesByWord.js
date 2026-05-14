import { eq, and, asc } from 'drizzle-orm';

import {
  db,
  notebookSettings,
  wordBookMapping,
  noteBookMapping,
  books,
  notes,
} from '../db';

export async function getNotesByWord(word) {
  return await db
    .select({
      id: wordBookMapping.id,
      bookId: wordBookMapping.bookId,
      name: books.name,
      isExpanded: notebookSettings.isExpanded,
      mode: notes.mode,
      content: notes.content,
      style: notes.style,
    })
    .from(notebookSettings)

    .innerJoin(
      wordBookMapping,
      and(
        eq(wordBookMapping.bookId, notebookSettings.bookId),
        eq(wordBookMapping.word, word),
      ),
    )

    .innerJoin(noteBookMapping, eq(noteBookMapping.id, wordBookMapping.id))

    .innerJoin(notes, eq(notes.id, noteBookMapping.noteId))

    .innerJoin(books, eq(books.id, wordBookMapping.bookId))

    .orderBy(asc(notebookSettings.noteOrder));
}
