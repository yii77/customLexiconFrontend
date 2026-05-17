import { useEffect, memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
} from 'react-native';

import DraggableFlatList, {
  OpacityDecorator,
} from 'react-native-draggable-flatlist';

import {
  DISPLAY_ORDER_OPTIONS,
  DISPLAY_ORDER_LABEL,
} from '../../../data/constants';

import { useWordOrder, useWordSection } from '../../../logic/hook/book';

import { Dropdown, ImageButton, EnglishText } from '../../component/ui';

import {
  atomLayout,
  atomTypography,
  compositeLayout,
  compositeEffect,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

export const DefaultHeader = memo(
  ({ displayBook, displayOrder, onUpdateDisplayOrder }) => {
    return (
      <View style={[compositeLayout.rowBetweenCenter]}>
        <TouchableOpacity
          style={[
            atomLayout.row,
            atomLayout.alignEnd,
            atomLayout.gapSM,
            style.bookNameContainer,
          ]}
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
            onSelect={onUpdateDisplayOrder}
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
