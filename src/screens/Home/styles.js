const React = require("react-native");
const { Dimensions } = React;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const logoHeight = 200;

export default {
  container: {
    backgroundColor: '#fff',
    position: 'relative',
  },
  touchablesContainer: {
    height: deviceWidth,
  },
  touchableContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  touchable: {
    flex: 1,
    marginHorizontal: '12%',
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
  logoContainer: {
    position: 'absolute',
    top: deviceHeight - logoHeight - 20,
    width: deviceWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logo: {
    width: deviceWidth * 0.75,
    height: logoHeight,
    resizeMode: 'contain',
  },
};