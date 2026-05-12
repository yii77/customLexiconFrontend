export const FONT_FAMILY = {
  Merriweather: 'Merriweather_24pt',
  Montserrat: 'Montserrat',
  思源黑体: 'NotoSansSC',
  思源宋体: 'NotoSerifSC',
  Nunito: 'Nunito',
  Outfit: 'Outfit',
  'Playfair Display': 'PlayfairDisplay',
  Poppins: 'Poppins',
  'Public Sans': 'PublicSans',
  'Source Serif': 'SourceSerif4',
  Raleway: 'Raleway',
};

export const FONT_WEIGHT = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

export const getFontFamily = (fontFamily, fontWeight, fontStyle = '') => {
  return `${FONT_FAMILY[fontFamily]}-${FONT_WEIGHT[fontWeight]}${fontStyle}`;
};
