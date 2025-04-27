// import { colors, dimensions, fonts, styleView } from '@app/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const CONTENT_VIEW_WIDTH = width - 60;
const BORDER_RADIUS = 8;
const BUTTON_VIEW_HEIGHT = 45;

export const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  alertWrapper: {
    width: CONTENT_VIEW_WIDTH,
    // backgroundColor: '#FFF',
    backgroundColor: '#1d1d1d',
    borderRadius: BORDER_RADIUS,
  },
  contentBlock: {
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  title: {
    // ...fonts.semi_bold18,
  },
  content: {
    // ...fonts.regular16,
    textAlign: 'center',
    marginTop: 12,
  },
  btnBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BUTTON_VIEW_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: '#3e3e40',
  },
  btnView: {
    // ...styleView.centerItem,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: BUTTON_VIEW_HEIGHT,
  },
  btnText: {
    // ...fonts.regular16,
    color: '#262626',
  },
});
