import { memo, useCallback } from 'react';

import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import { BG_COLOR, atomLayout } from '../../style';

import bookCover from '../../../../assets/bookCover/defaultCover.png';

export const BookList = ({ books, practiceBookId, onDownload }) => {
  const renderItem = useCallback(
    ({ item }) => {
      const isLearning = item._id === practiceBookId;

      return (
        <BookItem item={item} isLearning={isLearning} onPress={onDownload} />
      );
    },
    [practiceBookId, onDownload],
  );

  return (
    <FlatList
      data={books}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      extraData={practiceBookId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[atomLayout.gapBase]}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
};

const BookItem = memo(({ item, isLearning, onPress }) => {
  return (
    <TouchableOpacity
      style={style.bookItem}
      onPress={() => {
        onPress(item);
      }}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={item.cover ? { uri: item.cover } : bookCover}
        style={style.wordbookImage}
        imageStyle={style.imageInner}
      >
        <Text style={style.coverTitle}>{item.name}</Text>
      </ImageBackground>
      <View style={atomLayout.justifyBetween}>
        <Text>{item.name}</Text>
        {item.description ? (
          <Text style={style.description}>{item.description}</Text>
        ) : null}
        <View style={[atomLayout.row, atomLayout.gapBase]}>
          <Text>{item.word_count ?? 0} 个单词</Text>
          {isLearning && (
            <View>
              <Text style={style.learningTagText}>正在学习</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const style = StyleSheet.create({
  bookItem: {
    flexDirection: 'row',
    backgroundColor: BG_COLOR.bgCard,
    padding: 12,
    borderRadius: 18,
    gap: 12,
  },
  wordbookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    paddingTop: 1,
  },

  imageInner: {
    borderRadius: 8,
  },

  coverTitle: {
    color: '#4e5e6a',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginHorizontal: 4,
  },

  learningTagText: {
    fontSize: 12,
    color: '#79aac7',
  },
});
