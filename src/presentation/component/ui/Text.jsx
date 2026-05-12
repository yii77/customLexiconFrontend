import { Text } from 'react-native';

import { useContext } from 'react';

import { getFontFamily } from '../../../data/constants';

import { FontContext } from '../../../logic/context';

function CustomText({
  children,
  type = 'english',
  fontWeight,
  fontStyle,
  style,
}) {
  const { fonts } = useContext(FontContext);

  if (!fonts) return null;

  const baseFontFamily = type === 'chinese' ? fonts.chinese : fonts.english;

  const fontFamily = getFontFamily(baseFontFamily, fontWeight, fontStyle);

  return <Text style={[{ fontFamily }, style]}>{children}</Text>;
}

export function EnglishText(props) {
  return <CustomText {...props} type="english" />;
}

export function ChineseText(props) {
  return <CustomText {...props} type="chinese" />;
}
