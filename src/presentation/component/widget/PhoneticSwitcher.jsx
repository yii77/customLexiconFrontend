import { View, StyleSheet } from 'react-native';

import { useWordPhonetic } from '../../../logic/hook/word';

import { ImageButton, TextButton } from '../ui';

import { atomLayout, iconSource, TEXT_COLOR } from '../../style';

export const PhoneticSwitcher = ({ word }) => {
  const { phonetic, togglePhonetic, handlePronounce } = useWordPhonetic(word);

  return (
    <View style={atomLayout.row}>
      <ImageButton
        imageSource={iconSource.play}
        onPress={handlePronounce}
        imageStyle={style.playIcon}
      />

      <TextButton
        title={phonetic}
        onPress={togglePhonetic}
        textStyle={style.phoneticText}
      />
    </View>
  );
};

const style = StyleSheet.create({
  phoneticText: {
    color: TEXT_COLOR.tertiary,
    fontSize: 16,
    fontWeight: 400,
  },
  playIcon: {
    width: 21,
    height: 21,
    tintColor: TEXT_COLOR.tertiary,
  },
});
