var React = require('react-native');

var {
  StyleSheet,
  Dimensions,
} = React;

var deviceScreen = Dimensions.get('window');

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    width: deviceScreen.width,
    height: deviceScreen.height,
  },
  frontView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    width: deviceScreen.width,
    height: deviceScreen.height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
});
