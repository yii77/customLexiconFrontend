import { StyleSheet } from 'react-native';
import { BG_COLOR, BORDER_COLOR, SHADOW_COLOR, TEXT_COLOR } from '../../style';

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
  wordItemContainer: {
    backgroundColor: BG_COLOR.bgCard,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    boxShadow: `
          0 1px 4px ${SHADOW_COLOR.inner},
        `,
    borderWidth: 0.5,
    borderColor: SHADOW_COLOR.border,
  },

  modalDragHandle: {
    height: 3,
    width: '10%',
    backgroundColor: '#bcbcbc',
    borderRadius: 20,
    marginVertical: 5,
  },

  userWordbookModal: {
    minHeight: '80%',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  wordbookImage: {
    width: 45,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontWeight: '600',
    fontSize: 18,
  },
  subcategoryDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 3,
    maxHeight: 22,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: BORDER_COLOR.onBlue,
    alignSelf: 'flex-start',
  },
  subcategoryDropdownLabel: {
    fontSize: 13,
    color: TEXT_COLOR.tertiary,
    fontWeight: '500',
  },
  subcategoryDropdownMenu: {
    top: -1,
    left: -1,
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: 150,
  },
  subcategoryDropdownItemText: {
    fontSize: 13,
    color: '#555',
    flexShrink: 0,
  },
  addButton: {
    marginRight: 4,
    width: 18,
    height: 18,
    borderRadius: 16,
    backgroundColor: BG_COLOR.bgTab,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  emptyPrompt: {
    color: '#999',
    fontSize: 14,
  },
  learningWordbookContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#f2f2f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.17,
    shadowRadius: 32,
    elevation: 6,
  },
  bookItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookInfo: { gap: 4, flex: 1 },
});
