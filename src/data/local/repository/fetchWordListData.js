import { eq, asc, desc } from 'drizzle-orm';

import { db, books, unitBookMapping, wordBookMapping } from '../db';

import { DISPLAY_ORDER } from '../../constants';

export async function fetchWordListData(bookId, displayOrder) {
  switch (displayOrder) {
    case DISPLAY_ORDER.WORD_ORDER:
      return queryByWordOrder(bookId);

    case DISPLAY_ORDER.UNIT:
      return queryByUnit(bookId);

    case DISPLAY_ORDER.ALPHABET:
      return queryByAlphabet(bookId);

    case DISPLAY_ORDER.CREATE_TIME_ASC:
      return queryByCreateTime(bookId, 'asc');

    case DISPLAY_ORDER.CREATE_TIME_DESC:
      return queryByCreateTime(bookId, 'desc');

    default:
      return queryByWordOrder(bookId);
  }
}

async function queryByWordOrder(bookId) {
  return db
    .select({
      id: wordBookMapping.id,
      word: wordBookMapping.word,
      wordOrder: wordBookMapping.wordOrder,
    })
    .from(wordBookMapping)
    .where(eq(wordBookMapping.bookId, bookId))
    .orderBy(asc(wordBookMapping.wordOrder));
}

async function queryByUnit(bookId) {
  const units = await db
    .select()
    .from(unitBookMapping)
    .where(eq(unitBookMapping.bookId, bookId))
    .orderBy(asc(unitBookMapping.unitOrder));

  const words = await db
    .select({
      id: wordBookMapping.id,
      word: wordBookMapping.word,
      unitId: wordBookMapping.unitId,
      wordOrder: wordBookMapping.wordOrder,
    })
    .from(wordBookMapping)
    .where(eq(wordBookMapping.bookId, bookId))
    .orderBy(asc(wordBookMapping.wordOrder));

  const sectionMap = new Map(
    units.map(u => [
      u.id,
      {
        key: String(u.id),
        title: u.name,
        data: [],
      },
    ]),
  );

  const noUnit = {
    key: 'no-unit',
    title: '未分组',
    data: [],
  };

  for (const word of words) {
    if (word.unitId && sectionMap.has(word.unitId)) {
      sectionMap.get(word.unitId).data.push(word);
    } else {
      noUnit.data.push(word);
    }
  }

  const sections = [...sectionMap.values()];

  if (noUnit.data.length > 0) {
    sections.push(noUnit);
  }

  return sections;
}

async function queryByAlphabet(bookId) {
  const words = await db
    .select({
      id: wordBookMapping.id,
      word: wordBookMapping.word,
    })
    .from(wordBookMapping)
    .where(eq(wordBookMapping.bookId, bookId))
    .orderBy(asc(wordBookMapping.word));

  const sectionMap = new Map();

  for (const item of words) {
    const first = item.word[0]?.toUpperCase() ?? '#';
    const key = /^[A-Z]$/.test(first) ? first : '#';

    if (!sectionMap.has(key)) {
      sectionMap.set(key, {
        key,
        title: key,
        data: [],
      });
    }

    sectionMap.get(key).data.push(item);
  }

  return [...sectionMap.values()].sort((a, b) => {
    if (a.key === '#') return 1;
    if (b.key === '#') return -1;
    return a.key.localeCompare(b.key);
  });
}

async function queryByCreateTime(bookId, direction) {
  const words = await db
    .select({
      id: wordBookMapping.id,
      word: wordBookMapping.word,
      createAt: wordBookMapping.createAt,
    })
    .from(wordBookMapping)
    .where(eq(wordBookMapping.bookId, bookId))
    .orderBy(
      direction === 'asc'
        ? asc(wordBookMapping.createAt)
        : desc(wordBookMapping.createAt),
    );

  const sectionMap = new Map();

  for (const item of words) {
    const day = item.createAt ? item.createAt.slice(0, 10) : '未知';

    if (!sectionMap.has(day)) {
      sectionMap.set(day, {
        key: day,
        title: day,
        data: [],
      });
    }

    sectionMap.get(day).data.push(item);
  }

  return [...sectionMap.values()];
}
