import { memo } from 'react';
import { View, Text, ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { usePracticeBookCardData } from '../../../logic/hook/practice';

import { TextButton } from '../../component/ui';

import {
  atomLayout,
  compositeLayout,
  compositeEffect,
  atomTypography,
} from '../../style';
import style from './style';

import bookCover from '../../../../assets/bookCover/defaultCover.png';

export const PracticeBookCard = ({}) => {
  const { practiceBook, wordStatusCount } = usePracticeBookCardData();

  const navigation = useNavigation();

  return (
    <View style={[style.practiceBookCard, compositeEffect.primaryShadow]}>
      {practiceBook ? (
        <PracticeBookContent
          practiceBook={practiceBook}
          newCount={wordStatusCount?.[0]}
          learningCount={wordStatusCount?.[1]}
          masteredCount={wordStatusCount?.[2]}
          onChange={() => {
            navigation.navigate('LibraryScreen', {
              practiceBookId: practiceBook._id,
            });
          }}
        />
      ) : (
        <PracticeBookEmpty
          onChoose={() => {
            navigation.navigate('LibraryScreen');
          }}
        />
      )}
    </View>
  );
};

const PracticeBookContent = memo(
  ({ practiceBook, learningCount, masteredCount, newCount, onChange }) => {
    const totalCount = newCount + learningCount + masteredCount;
    const progress =
      totalCount === 0
        ? '0%'
        : `${Math.round((masteredCount / totalCount) * 100)}%`;

    return (
      <View
        style={[
          atomLayout.flex,
          compositeLayout.rowCenterCenter,
          atomLayout.paddingBase,
          atomLayout.gapBase,
        ]}
      >
        <ImageBackground
          source={practiceBook.cover ? { uri: practiceBook.cover } : bookCover}
          style={style.wordbookImage}
          imageStyle={style.imageInner}
        >
          <Text style={style.coverTitle}>{practiceBook.name}</Text>
        </ImageBackground>

        <View
          style={[
            atomLayout.flex,
            atomLayout.justifyBetween,
            atomLayout.fullHeight,
          ]}
        >
          {/* 标题 + 按钮 */}
          <View style={compositeLayout.rowBetweenCenter}>
            <Text style={[atomTypography.fontSemibold, atomTypography.textLG]}>
              {practiceBook?.name}
            </Text>

            <TextButton
              title="更换"
              onPress={onChange}
              buttonStyle={style.changeButton}
              textStyle={style.changeButtonText}
            />
          </View>

          {/* 进度条 */}
          <View style={style.progressBar}>
            <View style={[style.progressFinish, { width: progress }]} />
          </View>

          {/* 数据统计 */}
          <View style={[atomLayout.row, atomLayout.gapBase]}>
            <InfoText label="学习中" value={learningCount} />
            <InfoText label="已掌握" value={masteredCount} />
            <InfoText label="未学习" value={newCount} />
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.practiceBook?._id === nextProps.practiceBook?._id &&
      prevProps.newCount === nextProps.newCount &&
      prevProps.learningCount === nextProps.learningCount &&
      prevProps.masteredCount === nextProps.masteredCount
    );
  },
);

const InfoText = ({ label, value }) => (
  <Text style={[atomTypography.textXS, atomTypography.colorPrompt]}>
    <Text> {label}</Text>
    <Text style={atomTypography.fontMedium}> {value}</Text>
  </Text>
);

const PracticeBookEmpty = ({ onChoose }) => {
  return (
    <View
      style={[
        atomLayout.flex,
        atomLayout.gapSM,
        compositeLayout.columnCenterCenter,
      ]}
    >
      <Text style={[atomTypography.textSM, atomTypography.colorPrompt]}>
        暂无词书
      </Text>
      <TextButton
        title="选择词书"
        onPress={onChoose}
        buttonStyle={style.selectBookBtn}
        textStyle={[
          atomTypography.colorInverse,
          atomTypography.textMD,
          atomTypography.fontMedium,
        ]}
      />
    </View>
  );
};
