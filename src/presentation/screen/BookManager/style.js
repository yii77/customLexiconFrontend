import { StyleSheet } from 'react-native';
import { BG_COLOR, SHADOW_COLOR, TEXT_COLOR } from '../../style';

export default StyleSheet.create({
  bookNameContainer: {
    width: '60%',
  },
  bookName: {
    ellipsizeMode: 'tail',
    numberOfLines: 1,
    width: '100%',
  },
  menu: { right: 2, top: 0 },

  wordItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 8,
  },

  /* 左侧时间轴 */
  timeline: {
    width: 24,
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#e9ebf1',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#adb6c6',
    marginTop: 16,
  },

  /* 卡片 */
  card: {
    flex: 1,
    backgroundColor: BG_COLOR.bgCard,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_COLOR.secondary,
  },
  wordCount: {
    fontSize: 12,
    color: '#879ca3',
  },
  arrow: {
    width: 16,
    height: 16,
    tintColor: '#879ca3',
  },
  wordList: {
    marginTop: 8,
  },
  dash: {
    width: 6,
    height: 1,
    backgroundColor: '#e9e7e4',
  },
});
