import {
  useEffect,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import DraggableFlatList, {
  OpacityDecorator,
} from 'react-native-draggable-flatlist';

import {
  DISPLAY_ORDER_OPTIONS,
  DISPLAY_ORDER_LABEL,
} from '../../../data/constants';

import { PracticeBookContext } from '../../../logic/context';

import {
  useAllBook,
  useWordOrder,
  useWordSection,
} from '../../../logic/hook/book';

import { useCustomAlert } from '../../component/system';
import { Dropdown, ImageButton, EnglishText } from '../../component/ui';

import bookCover from '../../../../assets/bookCover/defaultCover.png';

import {
  atomLayout,
  atomTypography,
  compositeLayout,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

export const DefaultHeader = memo(
  ({
    displayBook,
    displayOrder,
    onSelectDisplayOrder,
    onSelectDisplayBook,
  }) => {
    const { showAlert } = useCustomAlert();
    const { practiceBook } = useContext(PracticeBookContext);

    const openAllBookModal = () => {
      showAlert({
        title: <AlertHeaderLine />,
        content: (
          <AllBookModalContent
            practiceBook={practiceBook}
            onSelectBook={onSelectDisplayBook}
          />
        ),
        buttons: [],
        type: 'bottom',
        alertStyle: style.userWordbookModal,
      });
    };

    return (
      <View style={[compositeLayout.rowBetweenCenter]}>
        <TouchableOpacity
          style={[
            atomLayout.row,
            atomLayout.alignEnd,
            atomLayout.gapSM,
            style.bookNameContainer,
          ]}
          onPress={openAllBookModal}
        >
          <Text
            style={[
              atomTypography.textXXL,
              atomTypography.fontMedium,
              atomTypography.colorBlack,
              style.bookName,
            ]}
            numberOfLines={1}
          >
            {displayBook?.name || '暂无词书'}
          </Text>

          <Image
            source={iconSource.down}
            style={[iconStyles.lg, atomTypography.tintPrimary]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={[compositeLayout.rowCenterCenter, atomLayout.gapSM]}>
          <Dropdown
            options={DISPLAY_ORDER_OPTIONS}
            value={DISPLAY_ORDER_LABEL[displayOrder]}
            onSelect={onSelectDisplayOrder}
            renderTrigger={() => (
              <Image
                source={iconSource.sort}
                style={[iconStyles.lg, atomTypography.tintPrimary]}
              />
            )}
            menuStyle={style.menu}
          />
          <ImageButton
            imageSource={iconSource.setting}
            imageStyle={[iconStyles.lg, atomTypography.tintPrimary]}
          />
        </View>
      </View>
    );
  },
);

export const ListContent = memo(
  ({ listData, isGrouped, displayOrder, bookId }) => {
    if (isGrouped) {
      return (
        <SectionList
          key={`section-${displayOrder}`}
          listData={listData}
          bookId={bookId}
          displayOrder={displayOrder}
        />
      );
    } else {
      return (
        <SortList
          key={`sort-${displayOrder}`}
          listData={listData}
          bookId={bookId}
        />
      );
    }
  },
);

const SortList = memo(({ listData, bookId }) => {
  const { words, handleReorder } = useWordOrder(bookId, listData);

  console.log(words);

  const keyExtractor = useCallback(item => {
    return item.id;
  }, []);

  const renderItem = useCallback(
    ({ item, drag }) => <SortListWordItem item={item} drag={drag} />,
    [],
  );

  const onDragEnd = useCallback(
    ({ data }) => {
      handleReorder(data);
    },
    [handleReorder],
  );

  return (
    <DraggableFlatList
      showsVerticalScrollIndicator={false}
      data={words}
      keyExtractor={keyExtractor}
      contentContainerStyle={[atomLayout.gapSM, atomLayout.paddingBottomTab]}
      onDragEnd={onDragEnd}
      renderItem={renderItem}
    />
  );
});

const SortListWordItem = memo(({ item, drag }) => {
  return (
    <OpacityDecorator>
      <Pressable
        onLongPress={drag}
        delayLongPress={150}
        style={style.wordItemContainer}
      >
        <EnglishText fontWeight={'500'} style={[atomTypography.textMD]}>
          {item.word}
        </EnglishText>
      </Pressable>
    </OpacityDecorator>
  );
});

const SectionList = memo(({ listData, bookId, displayOrder }) => {
  const { displaySection, toggleSection } = useWordSection(listData);

  const renderItem = useCallback(
    ({ item }) => <SectionCard section={item} onToggle={toggleSection} />,
    [toggleSection],
  );

  const keyExtractor = useCallback(item => {
    return item.key;
  });

  return (
    <FlatList
      data={displaySection}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
    />
  );
});

const SectionCard = memo(
  ({ section, onToggle }) => {
    const renderItem = useCallback(({ item }) => {
      return <SectionListWordItem word={item.word} />;
    }, []);

    const keyExtractor = useCallback(item => {
      return item.id;
    });

    const ItemSeparator = useCallback(() => {
      return <DashLine />;
    }, []);

    return (
      <View style={atomLayout.row}>
        <View style={style.timeline}>
          <View style={style.line} />
          <View style={style.dot} />
        </View>

        <View style={style.card}>
          <TouchableOpacity
            style={compositeLayout.rowBetweenCenter}
            onPress={() => onToggle(section.key)}
          >
            <Text style={style.sectionTitle}>{section.title}</Text>

            <View style={[compositeLayout.rowCenterCenter, atomLayout.gapSM]}>
              <Text style={style.wordCount}>{section.count}词</Text>

              <Image
                source={section.isExpanded ? iconSource.up : iconSource.down}
                style={style.arrow}
              />
            </View>
          </TouchableOpacity>

          {section.isExpanded && (
            <FlatList
              data={section.data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              style={style.wordList}
              ItemSeparatorComponent={ItemSeparator}
              scrollEnabled={false}
              removeClippedSubviews
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={7}
            />
          )}
        </View>
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.section.key === next.section.key &&
      prev.section.isExpanded === next.section.isExpanded &&
      prev.section.count === next.section.count &&
      prev.section.data === next.section.data
    );
  },
);

const SectionListWordItem = memo(({ word }) => {
  return (
    <TouchableOpacity style={style.wordItem}>
      <EnglishText fontWeight={'500'} style={[atomTypography.textMD]}>
        {word}
      </EnglishText>
    </TouchableOpacity>
  );
});

const DashLine = memo(() => {
  return (
    <View style={[atomLayout.row, atomLayout.justifyBetween]}>
      {Array.from({ length: 20 }).map((_, i) => (
        <View key={i} style={style.dash} />
      ))}
    </View>
  );
});

const AlertHeaderLine = memo(() => {
  return (
    <View style={[compositeLayout.rowCenterCenter]}>
      <View style={style.modalDragHandle} />
    </View>
  );
});

const AllBookModalContent = memo(({ practiceBook, onSelectBook }) => {
  const { allBook } = useAllBook(practiceBook);

  const renderItem = useCallback(({ item }) => {
    return <BookList item={item} onSelectBook={onSelectBook} />;
  }, []);

  return (
    <FlatList
      data={allBook}
      keyExtractor={item => item.category}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={atomLayout.gapXL}
      scrollEnabled={false}
    />
  );
});

const BookList = memo(({ item, onSelectBook }) => {
  const activeBooks = useMemo(() => {
    const grouped = {};
    item.books.forEach(book => {
      const key = book.subcategory || '未分类';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(book);
    });
    return grouped;
  }, [item.books]);

  const subcategoryOption = useMemo(
    () => Object.keys(activeBooks),
    [activeBooks],
  );

  const [activeSubcategory, setActiveSubcategory] = useState(
    subcategoryOption[0] || null,
  );

  useEffect(() => {
    if (
      subcategoryOption.length > 0 &&
      !subcategoryOption.includes(activeSubcategory)
    ) {
      setActiveSubcategory(subcategoryOption[0]);
    }
  }, [subcategoryOption]);

  const isCustomCategory =
    item.category === '单词本' || item.category === '笔记本';

  return (
    <View style={atomLayout.gapBase}>
      <CategoryHeader
        category={item.category}
        subcategoryOption={subcategoryOption}
        isCustomCategory={isCustomCategory}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={setActiveSubcategory}
      />

      {isCustomCategory ? (
        <BookListWithSubcategory
          category={item.category}
          books={activeBooks[activeSubcategory] || []}
          onSelectBook={onSelectBook}
        />
      ) : (
        <BookListNormal books={item.books} onSelectBook={onSelectBook} />
      )}
    </View>
  );
});

const CategoryHeader = memo(
  ({
    category,
    subcategoryOption,
    isCustomCategory,
    activeSubcategory,
    onSelectSubcategory,
  }) => {
    const navigation = useNavigation();
    const { hideAlert } = useCustomAlert();

    const navigateToAdd = () => {
      hideAlert();
      navigation.navigate('BookFormScreen', { category });
    };

    return (
      <View style={style.categoryHeader}>
        <View
          style={[atomLayout.row, atomLayout.alignCenter, atomLayout.gapBase]}
        >
          <Text style={style.categoryName}>{category}</Text>

          {isCustomCategory && subcategoryOption?.length > 0 && (
            <Dropdown
              options={subcategoryOption}
              value={activeSubcategory}
              placeholder="暂无分类"
              onSelect={onSelectSubcategory}
              triggerStyle={style.subcategoryDropdownTrigger}
              labelStyle={style.subcategoryDropdownLabel}
              menuStyle={[style.subcategoryDropdownMenu]}
              triggerArrowStyle={[iconStyles.md, iconStyles.colorTertiary]}
              itemTextStyle={style.subcategoryDropdownItemText}
            />
          )}
        </View>

        {isCustomCategory && (
          <ImageButton
            imageSource={iconSource.add}
            buttonStyle={style.addButton}
            onPress={navigateToAdd}
            imageStyle={[iconStyles.md, iconStyles.colorTertiary]}
          />
        )}
      </View>
    );
  },
);

const BookListWithSubcategory = memo(({ category, books, onSelectBook }) => {
  return (
    <View style={atomLayout.gapBase}>
      <View style={atomLayout.gapBase}>
        {books.length > 0 ? (
          books.map(book => (
            <BookItem key={book.id} book={book} onPress={onSelectBook} />
          ))
        ) : (
          <View style={style.emptyContainer}>
            <Text style={style.emptyPrompt}>暂无{category}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

const BookListNormal = memo(({ books, onSelectBook }) => {
  const book = books[0];
  if (!book)
    return (
      <View style={style.emptyContainer}>
        <Text style={style.emptyPrompt}>暂无在学词书</Text>
      </View>
    );

  return (
    <Pressable
      style={({ pressed }) => [style.learningWordbookContainer]}
      onPress={() => onSelectBook(book)}
    >
      <Image source={bookCover} style={style.wordbookImage} />
      <View style={atomLayout.justifyBetween}>
        <Text style={[atomTypography.fontMedium]}>{book.name}</Text>
        <Text style={[atomTypography.colorPrompt, atomTypography.textSM]}>
          {book.wordCount ?? 0} 个单词
        </Text>
      </View>
    </Pressable>
  );
});

const BookItem = memo(({ book, onPress }) => {
  const navigation = useNavigation();
  const { hideAlert } = useCustomAlert();

  const navigateToEdit = () => {
    hideAlert();
    navigation.navigate('BookFormScreen', { editingBook: book });
  };

  return (
    <View style={style.bookItem}>
      <TouchableOpacity style={style.bookInfo} onPress={() => onPress(book)}>
        <Text style={[atomTypography.fontMedium]}>{book.name}</Text>
        <Text style={[atomTypography.colorPrompt, atomTypography.textSM]}>
          {book.wordCount ?? 0}{' '}
          {book.category === '单词本' ? '个单词' : '条笔记'}
        </Text>
      </TouchableOpacity>
      <ImageButton
        imageSource={iconSource.edit}
        imageStyle={[iconStyles.xl, iconStyles.colorTertiary]}
        onPress={navigateToEdit}
      />
    </View>
  );
});
