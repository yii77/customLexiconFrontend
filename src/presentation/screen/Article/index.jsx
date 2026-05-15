import { useMemo, useState } from 'react';
import {
  View,
  Pressable,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';

import {
  usePracticeArticle,
  useArticleWordQuery,
} from '../../../logic/hook/practice';

import { parseArticle } from '../../../logic/util';

import {
  EnglishText,
  Page,
  CommonHeader,
  ChineseText,
  ImageButton,
  TextButton,
} from '../../component/ui';

import {
  atomLayout,
  atomTypography,
  iconSource,
  iconStyles,
} from '../../style';
import style from './style';

export default function ArticleScreen({ route, navigation }) {
  const wordArray = route?.params?.wordArray ?? null;

  const [showTranslation, setShowTranslation] = useState(false);

  const { articleData, generate } = usePracticeArticle(wordArray);

  const words = useMemo(() => {
    return parseArticle(articleData?.article);
  }, [articleData]);

  const { selectedWord, wordInfo, handlePress, resetWordInfo } =
    useArticleWordQuery();

  return (
    <Page>
      <View
        style={[atomLayout.flex, atomLayout.paddingBase, atomLayout.gapBase]}
      >
        <CommonHeader
          title={'词汇巩固阅读'}
          leftImageSource={iconSource.back}
          onLeftPress={() => navigation.goBack()}
        />
        {articleData && (
          <>
            <ScrollView>
              <View style={[atomLayout.row, atomLayout.wrap]}>
                {words.map((word, index) => {
                  const isWord = /^[a-zA-Z'-]+$/.test(word);

                  return (
                    <Pressable
                      key={`${word}-${index}`}
                      onPress={() => handlePress(word)}
                      disabled={!isWord}
                    >
                      <EnglishText
                        fontWeight={'500'}
                        style={[
                          atomTypography.textLG,
                          {
                            lineHeight: 26,
                          },
                        ]}
                      >
                        {word}
                        {isWord ? ' ' : ''}
                      </EnglishText>
                    </Pressable>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[
                  atomLayout.row,
                  atomLayout.gapMD,
                  atomLayout.alignCenter,
                  style.viewTransition,
                ]}
                onPress={() => {
                  setShowTranslation(prev => {
                    return !prev;
                  });
                }}
              >
                <Image
                  source={iconSource.view}
                  style={[iconStyles.lg, iconStyles.colorTertiary]}
                  resizeMode="contain"
                />
                <Text style={atomTypography.colorTertiary}>查看翻译</Text>
              </TouchableOpacity>

              {showTranslation && (
                <ChineseText fontWeight={'400'}>
                  {articleData.translation}
                </ChineseText>
              )}
            </ScrollView>

            <TextButton
              title={'重新生成'}
              buttonStyle={style.reloadButton}
              onPress={() => {
                setShowTranslation(false);
                generate();
              }}
              textStyle={[
                atomTypography.colorPrimary,
                atomTypography.fontSemibold,
                atomTypography.textLG,
              ]}
            />
          </>
        )}
      </View>
    </Page>
  );
}
