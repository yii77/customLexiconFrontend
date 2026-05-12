import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 76,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    zIndex: 9999,
    maxWidth: '80%',
  },

  text: {
    color: '#fff',
    fontSize: 14,
  },

  success: {
    backgroundColor: '#6ca762',
  },

  error: {
    backgroundColor: '#aa3f3f',
  },

  info: {
    backgroundColor: '#399a9c',
  },
});
