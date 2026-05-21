import { StyleSheet } from 'react-native';

import { BG_COLOR, BORDER_COLOR } from '../../style';

export default StyleSheet.create({
  card: {
    gap: 10,
    backgroundColor: BG_COLOR.bgCard,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  subcategoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffffff00',
    backgroundColor: BG_COLOR.bgTab,
  },
  subcategoryTabActive: {
    borderColor: BORDER_COLOR.onBlue,
  },
  textInput: {
    borderBottomColor: '#dedede',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: BG_COLOR.primaryLight,
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 20,
  },
});
