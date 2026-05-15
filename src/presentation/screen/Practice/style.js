import { StyleSheet } from 'react-native';

import { BG_COLOR, BORDER_COLOR, TEXT_COLOR } from '../../style';

export default StyleSheet.create({
  progressHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  progressWrapper: {
    flex: 1,
    marginLeft: 4,
    marginRight: 10,
    justifyContent: 'space-between',
    bottom: 3,
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#8e8a8317',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  completed: {
    backgroundColor: BG_COLOR.primaryLight,
    borderRadius: 999,
  },

  sessionListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 10,
    paddingHorizontal: 14,

    backgroundColor: '#fff',
    borderRadius: 12,
  },
  articleButton: {
    backgroundColor: '#f1f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bccad0',
    marginTop: 24,
    marginBottom: 8,
  },
  phoneticContainer: { left: 10, bottom: 10 },

  enTitle: { fontSize: 25, left: 4 },

  otherInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 8,
  },

  noteCard: { borderRadius: 20, padding: 16 },

  definitionTitle: {
    fontSize: 14,
    textAlign: 'left',
    letterSpacing: 0.2,
    lineHeight: 20,
  },

  veil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },

  progressText: {
    fontWeight: '500',
    fontSize: 14,
    color: TEXT_COLOR.tertiary,
    lineHeight: 24,
  },
  levelButton: {
    width: 24,
    height: 24,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR.onWhite,
  },
  activeLevelButton: {
    backgroundColor: BG_COLOR.primaryExtraLight,
    borderColor: BORDER_COLOR.onBlue,
  },
  levelText: {
    fontSize: 14,
    color: TEXT_COLOR.tertiary,
    fontWeight: '500',
  },
  activeLevelText: {
    color: '#3a5574',
    fontWeight: '500',
  },

  optionBtn: {
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden',
  },
  enOption: { paddingVertical: 11 },
  cnOption: { paddingTop: 5, paddingBottom: 6 },
  optionCorrect: {
    backgroundColor: '#EBF2E8',
    borderWidth: 0.5,
    borderColor: '#C2D9BB',
    paddingHorizontal: 16,
  },
  optionWrong: {
    backgroundColor: '#F5EDEA',
    borderWidth: 0.5,
    borderColor: '#DFC0B8',
    paddingHorizontal: 16,
  },

  inputContainer: { gap: 8, flexDirection: 'row' },

  input: {
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },

  submitBtn: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
    width: '100%',
    gap: 16,
    height: 70,
    backgroundColor: BG_COLOR.bgPage,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: BG_COLOR.bgTertiary,
  },
  btnBase: {
    height: 4,
    width: 17,
    bottom: 24,
    alignSelf: 'center',
    borderRadius: 999,
    position: 'absolute',
  },
  btnGreen: {
    backgroundColor: '#a8d2a5',
  },
  btnRed: {
    backgroundColor: '#cf8c8c',
  },
  btnGray: {
    backgroundColor: '#8E8E93',
  },

  btnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
