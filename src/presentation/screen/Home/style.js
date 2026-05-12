import { StyleSheet } from 'react-native';

import {
  BG_COLOR,
  SPACING,
  RADIUS,
  TEXT_COLOR,
  BORDER_COLOR,
} from '../../style/foundation/token';

export default StyleSheet.create({
  practiceBookCard: {
    minHeight: 112,
    backgroundColor: BG_COLOR.bgCard,
    borderRadius: 20,
  },
  selectBookBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: BG_COLOR.primaryLight,
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
  changeButton: {
    justifyContent: 'center',
    borderWidth: 0.8,
    borderRadius: 8,
    borderColor: BORDER_COLOR.tertiary,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  changeButtonText: {
    color: TEXT_COLOR.tertiary,
    fontSize: 12,
    lineHeight: 12,
  },
  progressBar: {
    marginTop: 16,
    backgroundColor: BG_COLOR.primaryExtraLight,
    width: '100%',
    height: 4,
    borderRadius: 999,
  },
  progressFinish: {
    backgroundColor: BG_COLOR.primaryLight,
    height: 4,
    borderRadius: 999,
  },
});
