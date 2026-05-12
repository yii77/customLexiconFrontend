import { StyleSheet } from 'react-native';

import { BG_COLOR, BORDER_COLOR } from '../../style';

export default StyleSheet.create({
  searchTextInput: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#eeeeeea0',
  },
  placeholder: {
    color: '#999',
  },

  border: {
    width: '100%',
    height: 1,
    backgroundColor: BORDER_COLOR.onPage,
  },

  categoryItem: {
    paddingBottom: 14,
  },

  categorySelected: {
    zIndex: 99,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: '100%',
    height: 2.1,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: BG_COLOR.primaryLight,
  },

  subcategoryDefault: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eeeeeec2',
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff00',
  },
  subcategorySelected: {
    backgroundColor: BG_COLOR.primaryExtraLight,
    borderWidth: 1,
    borderColor: BORDER_COLOR.onBlue,
  },

  bookItem: {
    flexDirection: 'row',
    backgroundColor: BG_COLOR.bgCard,
    padding: 12,
    borderRadius: 18,
  },
  wordbookImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 6,
  },

  imageInner: {
    borderRadius: 8,
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.25)', // 提高文字可读性
  },

  coverTitle: {
    color: '#4e5e6a',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginHorizontal: 4,
  },

  wordbookImage: {
    width: 60,
    height: 80,
    backgroundColor: '#c7d3d8', // 占位颜色
    borderRadius: 8,
    marginRight: 12,
  },

  learningTagText: {
    fontSize: 12,
    //color: Theme.colors.lineLightBlue,
  },
});
