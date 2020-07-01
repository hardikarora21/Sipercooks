import {StyleSheet, Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Spacing from './src/styles/spacing';
import Theme from './src/styles/theme';
export default StyleSheet.create({
  heightWidth: {
    height: deviceHeight,
    width: deviceWidth,
  },
  imageBackgroundStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fcf0e2',
  },

  placeholderBackground: {
    // backgroundColor: Theme.colors.placeholderBlackLight,
    height: '100%',
    justifyContent: 'space-between',
    width: '100%',
  },

  logoImage: {
    height: 52,
    marginTop: 102,
    width: 52,
  },

  logoTextImage: {
    height: 16,
    marginTop: 140,
    width: 120,
  },

  textBold: {
    // color: Theme.colors.textLight,
    fontWeight: 'bold',
  },

  ImageStyle: {
    height: 18,
    width: 18,
    marginHorizontal: 8,
    borderRadius: 20,
  },

  textWhite: {
    color: Theme.colors.textLight,
  },

  searchBarContainer: {
    paddingHorizontal: 4,
    width: '92%',
    height: Spacing.height6,
    borderRadius: 5,
    backgroundColor: Theme.colors.surface,
    marginVertical: 10,
  },

  textInputSearch: {
    height: Spacing.height5,
    width: '80%',
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textPlaceholder: {
    color: Theme.colors.placeholder,
  },

  buttonStyle: {
    width: '100%',
    height: 42,
    backgroundColor: '#d11011',
  },
  buttonStyle2: {
    // width: '100%',
    height: 42,
    backgroundColor: 'red',
  },
  textSearchButton: {
    borderRadius: 5,
    width: '20%',
    height: 42,
    backgroundColor: '#d11011',
  },

  TrucallerWrapper: {
    alignSelf: 'center',
    paddingHorizontal: 4,
    width: '92%',
    height: Spacing.height6,
    borderRadius: 5,
    backgroundColor: '#2589FF',
    marginTop: 4,
    marginBottom: 26,
  },

  tranparentView: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },

  margin: {
    marginVertical: 8,
  },

  menuWrapper: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  menuIcon: {
    alignSelf: 'flex-end',
  },

  menuContainer: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  menuListText: {
    marginVertical: 6,
  },

  rowContainer: {
    paddingTop: 12,
  },

  textButton: {
    color: Theme.colors.primary,
  },

  editButtonContainer: {
    marginLeft: 8,
    height: Spacing.height3,
    backgroundColor: Theme.colors.surface,
  },

  input: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.placeholderBlackLight2,
  },

  VerifyButtonstyle: {
    width: '100%',
    height: Spacing.height4,
    backgroundColor: '#D9534F',
  },

  VerifyButtonContainer: {
    width: 80,
    borderRadius: 5,
    marginLeft: 8,
    height: Spacing.height4,
    backgroundColor: '#D9534F',
    marginBottom: 12,
  },

  TextPrimary: {
    color: Theme.colors.primary,
  },

  verticalMargin: {
    marginVertical: 20,
  },
});
