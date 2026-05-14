import { memo, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { useChoiceData, useStarLevel } from '../../../logic/hook/practice';
import { useWordPhonetic } from '../../../logic/hook/word';

import {
  TextButton,
  ImageButton,
  EnglishText,
  ChineseText,
} from '../../component/ui';
import { WordDataSection, PhoneticSwitcher } from '../../component/widget';

import {
  atomLayout,
  atomTypography,
  BG_COLOR,
  compositeEffect,
  compositeLayout,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

export const ProgressHeader = ({ word, progress }) => {
  const { completed, total } = progress;

  const navigation = useNavigation();

  const completedRatio = useMemo(() => {
    return completed / total;
  }, [completed, total]);

  return (
    <View style={style.progressHeaderContainer}>
      <ImageButton
        imageSource={iconSource.back}
        imageStyle={[iconStyles.lg]}
        onPress={() => {
          navigation.goBack();
        }}
      />

      <View style={style.progressWrapper}>
        <View style={style.track}>
          <View
            style={[style.completed, { width: `${completedRatio * 100}%` }]}
          />
        </View>
      </View>

      <View style={atomLayout.row}>
        <ImageButton
          imageSource={iconSource.collect}
          imageStyle={[iconStyles.lg]}
        />
        <ImageButton
          imageSource={iconSource.setting}
          imageStyle={[iconStyles.lg]}
          onPress={() => {
            navigation.navigate('PracticeSettingScreen');
          }}
        />
      </View>
    </View>
  );
};

export const PracticeContent = ({
  currentWord,
  completeStep,
  updateStatus,
}) => {
  const flow = currentWord.flow;

  switch (flow) {
    case 'note':
      return (
        <WordNoteMode
          word={currentWord.word}
          starLevel={currentWord.starLevel}
          step={currentWord.step}
          totalStep={currentWord.totalStep}
          completeStep={completeStep}
          updateStatus={updateStatus}
        />
      );
    case 'cnToEn':
      return (
        <CnToEnChoiceMode
          word={currentWord.word}
          starLevel={currentWord.starLevel}
          step={currentWord.step}
          totalStep={currentWord.totalStep}
          completeStep={completeStep}
          updateStatus={updateStatus}
        />
      );
    case 'enToCn':
      return (
        <EnToCnChoiceMode
          word={currentWord.word}
          starLevel={currentWord.starLevel}
          step={currentWord.step}
          totalStep={currentWord.totalStep}
          completeStep={completeStep}
          updateStatus={updateStatus}
        />
      );
    case 'spelling':
      return (
        <SpellingMode
          word={currentWord.word}
          starLevel={currentWord.starLevel}
          step={currentWord.step}
          totalStep={currentWord.totalStep}
          completeStep={completeStep}
          updateStatus={updateStatus}
        />
      );
    case 'recall':
      return (
        <RecallMode
          word={currentWord.word}
          starLevel={currentWord.starLevel}
          step={currentWord.step}
          totalStep={currentWord.totalStep}
          completeStep={completeStep}
          updateStatus={updateStatus}
        />
      );
  }
};

const WordNoteMode = memo(
  ({
    word,
    starLevel,
    step,
    totalStep,
    completeStep,
    isFromWrong,
    isFromFuzzy,
  }) => {
    const { currentStarLevel, updateStarLevel } = useStarLevel(starLevel);

    let type = null;

    if (!isFromWrong && !isFromFuzzy) {
      type = 'correct';
    } else if (isFromWrong) {
      type = 'wrong';
    } else if (isFromFuzzy) {
      type = 'fuzzy';
    }

    const handleNext = () => {
      if (isFromWrong) {
        completeStep(0);
      } else if (isFromFuzzy) {
        completeStep(1);
      } else {
        completeStep(2);
      }
    };

    return (
      <View style={[atomLayout.gapBase, atomLayout.flex]}>
        <View style={[atomLayout.row, atomLayout.gapSM, atomLayout.alignEnd]}>
          <EnglishText fontWeight={'700'} style={style.enTitle}>
            {word}
          </EnglishText>
          <View style={style.phoneticContainer}>
            <PhoneticSwitcher word={word} />
          </View>
        </View>

        <OtherInfo
          word={word}
          step={step}
          totalStep={totalStep}
          currentStarLevel={currentStarLevel}
          updateStarLevel={updateStarLevel}
          show={true}
        />

        <View style={[atomLayout.gapSM, atomLayout.flex]}>
          <PromptText prompt={'记住释义'} />
          <View
            style={[
              style.noteCard,
              compositeEffect.secondaryShadow,
              atomLayout.flex,
            ]}
          >
            <WordDataSection word={word} />
          </View>
        </View>
        <View style={style.btnRow}>
          <PracticeButton title={'下一词'} type={type} onPress={handleNext} />
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.word === nextProps.word;
  },
);

const shuffle = array => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

const MODE = {
  EN_TO_CN: 'en_to_cn',
  CN_TO_EN: 'cn_to_en',
};

const ChoiceMode = memo(
  ({ mode, word, starLevel, step, totalStep, completeStep, updateStatus }) => {
    const [longPressedIndex, setLongPressedIndex] = useState(null);
    const [answerState, setAnswerState] = useState(null);
    const [showNotes, setShowNotes] = useState(false);

    const { currentStarLevel, updateStarLevel } = useStarLevel(starLevel);

    const { data } = useChoiceData(word);
    const isEnToCn = mode === MODE.EN_TO_CN;

    useEffect(() => {
      setLongPressedIndex(null);
      setAnswerState(null);
      setShowNotes(false);
    }, [word]);

    const allOptions = useMemo(() => {
      if (!data) return null;

      const correctOption = {
        word: data.word,
        definition: isEnToCn
          ? data.definition
          : formatDefinition(data.definition),
        isCorrect: true,
      };

      const wrongOptions = (data.distractors || []).map(d => ({
        word: d.word,
        definition: isEnToCn
          ? d.definition
          : formatDefinition(d.definition || '[]'),
        isCorrect: false,
      }));

      return shuffle([...wrongOptions, correctOption]);
    }, [data, isEnToCn]);

    if (!data || !allOptions) {
      return <Text>加载中...</Text>;
    }

    const handleSelect = index => {
      if (answerState) return;

      const option = allOptions[index];

      if (option.isCorrect) {
        setAnswerState({
          selectedIndex: index,
        });

        updateStatus(2);
      } else {
        const correctIndex = allOptions.findIndex(op => op.isCorrect);

        setAnswerState({
          selectedIndex: index,
          correctIndex,
        });

        updateStatus(0);
      }
    };

    const answered = !!answerState;

    const isCorrect =
      answered && allOptions[answerState.selectedIndex]?.isCorrect;

    const handleNext = () => {
      if (!answered) return;

      completeStep(isCorrect ? 2 : 0);
    };

    const handleShowAnswer = () => {
      setAnswerState({
        selectedIndex: null,
        correctIndex: allOptions.findIndex(o => o.isCorrect),
      });

      updateStatus(0);
    };

    if (showNotes) {
      return (
        <WordNoteMode
          word={word}
          starLevel={currentStarLevel}
          step={step}
          totalStep={totalStep}
          completeStep={completeStep}
          isFromFuzzy={isCorrect}
          isFromWrong={!isCorrect}
        />
      );
    }

    const title = isEnToCn ? (
      <View style={[atomLayout.row, atomLayout.gapSM, atomLayout.alignEnd]}>
        <EnglishText fontWeight={'700'} style={style.enTitle}>
          {word}
        </EnglishText>
        <View style={style.phoneticContainer}>
          <PhoneticSwitcher word={word} />
        </View>
      </View>
    ) : (
      <ChineseText fontWeight={500} style={style.definitionTitle}>
        {formatDefinition(data.definition)}
      </ChineseText>
    );

    return (
      <View style={[atomLayout.gapBase, atomLayout.flex]}>
        {title}

        <OtherInfo
          word={word}
          step={step}
          totalStep={totalStep}
          currentStarLevel={currentStarLevel}
          updateStarLevel={answered ? updateStarLevel : undefined}
          show={answered}
        />

        <View style={[atomLayout.gapSM, atomLayout.flex]}>
          <PromptText prompt={'选择正确选项'} />

          <FlatList
            style={atomLayout.flex}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={atomLayout.gapSM}
            data={allOptions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: op, index }) => {
              const isLongPressed = longPressedIndex === index;

              let optionStyle = [style.optionBtn];

              if (answered) {
                if (answerState.selectedIndex === index) {
                  optionStyle.push(
                    op.isCorrect ? style.optionCorrect : style.optionWrong,
                  );
                } else if (answerState.correctIndex === index) {
                  optionStyle.push(style.optionCorrect);
                }
              }

              const containerStyle = isLongPressed
                ? isEnToCn
                  ? style.enOption
                  : style.cnOption
                : isEnToCn
                ? style.cnOption
                : style.enOption;

              return (
                <TouchableOpacity
                  style={[
                    containerStyle,
                    compositeEffect.secondaryShadow,
                    ...optionStyle,
                  ]}
                  onPress={() => handleSelect(index)}
                  onLongPress={() => setLongPressedIndex(index)}
                  onPressOut={() => setLongPressedIndex(null)}
                  activeOpacity={1}
                >
                  {isLongPressed ? (
                    isEnToCn ? (
                      <EnglishText
                        fontWeight={500}
                        style={atomTypography.textBase}
                      >
                        {op.word}
                      </EnglishText>
                    ) : (
                      <ChineseText
                        fontWeight={500}
                        style={atomTypography.textBase}
                      >
                        {op.definition}
                      </ChineseText>
                    )
                  ) : isEnToCn ? (
                    <ChineseText
                      fontWeight={500}
                      style={atomTypography.textBase}
                    >
                      {formatDefinition(op.definition)}
                    </ChineseText>
                  ) : (
                    <EnglishText
                      fontWeight={500}
                      style={atomTypography.textBase}
                    >
                      {op.word}
                    </EnglishText>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={style.btnRow}>
          <ButtonGroup
            answered={answered}
            isCorrect={isCorrect}
            onShowAnswer={handleShowAnswer}
            onDetail={() => {
              setShowNotes(true);
            }}
            onNext={handleNext}
          />
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.word === nextProps.word,
);

const EnToCnChoiceMode = props => (
  <ChoiceMode {...props} mode={MODE.EN_TO_CN} />
);

const CnToEnChoiceMode = props => (
  <ChoiceMode {...props} mode={MODE.CN_TO_EN} />
);

const SpellingMode = memo(
  ({ word, starLevel, step, totalStep, completeStep, updateStatus }) => {
    const [inputValue, setInputValue] = useState('');
    const [answerState, setAnswerState] = useState(null);
    const [showNotes, setShowNotes] = useState(false);

    const { currentStarLevel, updateStarLevel } = useStarLevel(starLevel);

    const { handlePronounce } = useWordPhonetic(word);

    useEffect(() => {
      setInputValue('');
      setAnswerState(null);
      setShowNotes(false);

      handlePronounce();
    }, [word]);

    const handleSubmit = () => {
      if (answerState) return;

      const correct = inputValue.trim().toLowerCase() === word.toLowerCase();

      setAnswerState({
        isCorrect: correct,
      });

      updateStatus(correct ? 2 : 0);
    };

    const answered = !!answerState;
    const isCorrect = answerState?.isCorrect;

    const handleNext = () => {
      if (!answered) return;

      completeStep(isCorrect ? 2 : 0);
    };

    const handleShowAnswer = () => {
      if (answered) return;

      setAnswerState({
        isCorrect: false,
      });

      updateStatus(0);
    };

    if (showNotes) {
      return (
        <WordNoteMode
          word={word}
          starLevel={currentStarLevel}
          step={step}
          totalStep={totalStep}
          completeStep={completeStep}
          isFromFuzzy={isCorrect}
          isFromWrong={!isCorrect}
        />
      );
    }

    return (
      <View style={[atomLayout.gapBase, atomLayout.flex]}>
        <View style={[atomLayout.alignCenter]}>
          <View style={[atomLayout.row, atomLayout.gapSM, atomLayout.alignEnd]}>
            <EnglishText fontWeight={'700'} style={style.enTitle}>
              {word}
            </EnglishText>
            <View style={style.phoneticContainer}>
              <PhoneticSwitcher word={word} />
            </View>
          </View>
          {!answered && (
            <LinearGradient
              colors={[BG_COLOR.bgCard, BG_COLOR.bgPage]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={style.veil}
            />
          )}
        </View>
        <OtherInfo
          word={word}
          step={step}
          totalStep={totalStep}
          currentStarLevel={currentStarLevel}
          updateStarLevel={answered ? updateStarLevel : undefined}
          show={answered}
        />

        <TouchableOpacity
          style={[atomLayout.gapSM, atomLayout.flex]}
          onPress={handlePronounce}
          activeOpacity={1}
        >
          <PromptText prompt={'默写单词'} />

          <View style={style.inputContainer}>
            <TextInput
              style={[
                style.input,
                compositeEffect.secondaryShadow,
                answered &&
                  (isCorrect ? style.optionCorrect : style.optionWrong),
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!answered}
            />

            <ImageButton
              imageSource={iconSource.select}
              buttonStyle={[style.submitBtn, compositeEffect.secondaryShadow]}
              onPress={handleSubmit}
              disabled={answered}
              imageStyle={[iconStyles.lg]}
            />
          </View>
        </TouchableOpacity>

        <View style={style.btnRow}>
          <ButtonGroup
            answered={answered}
            isCorrect={isCorrect}
            onShowAnswer={handleShowAnswer}
            onDetail={() => setShowNotes(true)}
            onNext={handleNext}
          />
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.word === nextProps.word,
);

const RecallMode = memo(
  ({ word, starLevel, step, totalStep, completeStep, updateStatus }) => {
    const [showDefinition, setShowDefinition] = useState(false);

    const [answerState, setAnswerState] = useState(null);

    const { currentStarLevel, updateStarLevel } = useStarLevel(starLevel);

    useEffect(() => {
      setShowDefinition(false);
      setAnswerState(null);
    }, [word]);

    const handleRemember = () => {
      setShowDefinition(true);

      setAnswerState({
        isCorrect: true,
      });

      updateStatus(2);
    };

    const handleForget = () => {
      setShowDefinition(true);

      setAnswerState({
        isCorrect: false,
      });

      updateStatus(0);
    };

    const answered = !!answerState;
    const isCorrect = answerState?.isCorrect;

    const handleNext = () => {
      if (!answered) return;

      completeStep(isCorrect ? 2 : 0);
    };

    return (
      <View style={[atomLayout.gapBase, atomLayout.flex]}>
        <EnglishText fontWeight={'700'} style={style.enTitle}>
          {word}
        </EnglishText>

        <OtherInfo
          word={word}
          step={step}
          totalStep={totalStep}
          currentStarLevel={currentStarLevel}
          updateStarLevel={answered ? updateStarLevel : undefined}
          show={answered}
        />

        <View style={[atomLayout.gapSM, atomLayout.flex]}>
          <PromptText prompt={'回忆释义'} />

          {showDefinition && (
            <View
              style={[
                style.noteCard,
                compositeEffect.secondaryShadow,
                atomLayout.flex,
              ]}
            >
              <WordDataSection word={word} />
            </View>
          )}
        </View>

        <View style={style.btnRow}>
          {!answered ? (
            <>
              <PracticeButton
                title={'不记得'}
                type={'wrong'}
                onPress={handleForget}
              />

              <PracticeButton
                title={'记得'}
                type={'correct'}
                onPress={handleRemember}
              />
            </>
          ) : (
            <ButtonGroup
              answered={answered}
              isCorrect={isCorrect}
              onWrong={() => {
                completeStep(0);
              }}
              onDetail={() => {
                completeStep(1);
              }}
              onNext={handleNext}
              isRecall={true}
            />
          )}
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.word === nextProps.word,
);

const OtherInfo = ({
  word,
  step,
  totalStep,
  currentStarLevel,
  updateStarLevel,
  show,
}) => {
  return (
    <View style={[style.otherInfoContainer, compositeEffect.secondaryShadow]}>
      <PracticeProgress step={step} totalStep={totalStep} show={show} />
      <WordStarLevel
        word={word}
        starLevel={currentStarLevel}
        onUpdateWordStar={updateStarLevel}
        show={show}
      />
    </View>
  );
};

const PracticeProgress = ({ step, totalStep, show }) => {
  return (
    <View style={[atomLayout.gapSM, atomLayout.row, atomLayout.alignCenter]}>
      <Text style={[atomTypography.colorPrompt, atomTypography.fontMedium]}>
        进度
      </Text>
      <View style={[atomLayout.alignCenter]}>
        <Text style={style.progressText}>
          {step} / {totalStep}
        </Text>
        {!show && (
          <LinearGradient
            colors={[BG_COLOR.bgCard, BG_COLOR.bgPage]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={style.veil}
          />
        )}
      </View>
    </View>
  );
};

const WordStarLevel = ({ show, word, starLevel, onUpdateWordStar }) => {
  const safeStar = Math.max(1, Math.min(5, starLevel || 1));

  return (
    <View style={[atomLayout.gapSM, atomLayout.row, atomLayout.alignCenter]}>
      <Text style={[atomTypography.colorPrompt, atomTypography.fontMedium]}>
        难度
      </Text>

      <View>
        <View style={[atomLayout.gapSM, compositeLayout.rowBetweenCenter]}>
          {Array.from({ length: 5 }).map((_, index) => {
            const level = index + 1;
            const active = level === safeStar;

            return (
              <TextButton
                key={index}
                title={level}
                onPress={() => onUpdateWordStar?.(word, level)}
                disabled={!onUpdateWordStar || !show}
                buttonStyle={[
                  style.levelButton,
                  active && style.activeLevelButton,
                ]}
                textStyle={[style.levelText, active && style.activeLevelText]}
              />
            );
          })}
        </View>
        {!show && (
          <LinearGradient
            colors={[BG_COLOR.bgCard, BG_COLOR.bgPage]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={style.veil}
          />
        )}
      </View>
    </View>
  );
};

const PromptText = ({ prompt }) => {
  return (
    <Text
      style={[
        atomTypography.fontMedium,
        atomTypography.textSM,
        atomTypography.colorPrompt,
        { left: 4 },
      ]}
    >
      {prompt}
    </Text>
  );
};

const ButtonGroup = ({
  answered,
  isCorrect,
  isRecall,
  onShowAnswer,
  onDetail,
  onNext,
  onWrong,
}) => {
  if (!answered) {
    return (
      <PracticeButton
        title={'显示答案'}
        type={'wrong'}
        onPress={onShowAnswer}
      />
    );
  }

  if (isCorrect) {
    return (
      <View style={[atomLayout.row, atomLayout.flex]}>
        {isRecall && (
          <PracticeButton title={'记错了'} type={'wrong'} onPress={onWrong} />
        )}
        <PracticeButton title={'模糊'} type={'fuzzy'} onPress={onDetail} />
        <PracticeButton title={'下一词'} type={'correct'} onPress={onNext} />
      </View>
    );
  } else {
    return (
      <View style={[atomLayout.row, atomLayout.flex]}>
        <PracticeButton title={'下一词'} type={'wrong'} onPress={onNext} />
        {!isRecall && (
          <PracticeButton
            title={'详细学习'}
            type={'wrong'}
            onPress={onDetail}
          />
        )}
      </View>
    );
  }
};

const PracticeButton = ({ title, onPress, disabled, type = 'correct' }) => {
  return (
    <View style={atomLayout.flex}>
      <TextButton
        title={title}
        onPress={onPress}
        disabled={disabled}
        buttonStyle={style.btn}
        textStyle={style.btnText}
        activeButtonStyle={style.btnActive}
      />

      <View style={[style.btnBase, BTN_TYPE_STYLE[type]]} />
    </View>
  );
};

const BTN_TYPE_STYLE = {
  correct: style.btnGreen,
  wrong: style.btnRed,
  fuzzy: style.btnGray,
};

const formatDefinition = definitionStr => {
  if (!definitionStr) return '';

  let arr;
  try {
    arr = JSON.parse(definitionStr);
  } catch (e) {
    return '';
  }

  const processed = arr.map(obj => {
    const pos = obj.part_of_speech || '';
    const meaning = obj.meaning_cn || '';
    return `${pos}. ${meaning}`;
  });

  return processed.join('\n');
};
