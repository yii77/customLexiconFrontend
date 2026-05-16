import { StyleSheet, Dimensions } from 'react-native';

import { BG_COLOR, BORDER_COLOR, ICON_COLOR, TEXT_COLOR } from '../../style';

const { width } = Dimensions.get('window');

const BOX_WIDTH = (width - 98) / 5;

export default StyleSheet.create({
  section: { backgroundColor: BG_COLOR.bgCard, padding: 16, borderRadius: 14 },

  sectionTitle: {
    color: TEXT_COLOR.black,
    fontFamily: 'NotoSansSC-Medium',
    fontSize: 15,
    lineHeight: 17,
    paddingBottom: 1.5,
    left: 1,
  },
  stageTabContainer: {
    gap: 8,
    borderRadius: 8,
    borderColor: BORDER_COLOR.onTab,
    borderWidth: 1,
    padding: 4,
  },
  stageTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 4,
  },
  stageTabActive: {
    backgroundColor: BG_COLOR.bgTab,
  },

  numBox: {
    borderWidth: 1,
    borderColor: BORDER_COLOR.onTab,
    backgroundColor: BG_COLOR.bgTab,
    borderRadius: 10,
    width: BOX_WIDTH,
  },

  numInput: {
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR.input,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 8,
    color: TEXT_COLOR.black,
    marginBottom: 12,
  },

  brushModeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: BG_COLOR.bgTab,
    alignItems: 'center',
  },

  difficultyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR.onWhite,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  difficultyText: {
    fontSize: 14,
    color: TEXT_COLOR.black,
    fontWeight: '500',
  },

  difficultyLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: TEXT_COLOR.black,
  },

  difficultyHint: {
    fontSize: 14,
    color: TEXT_COLOR.tertiary,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER_COLOR.onCard,
    marginHorizontal: 16,
  },

  leftSection: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSession: {
    marginBottom: 16,
  },
});
