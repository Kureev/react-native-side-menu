const React = require('react-native');

const {
  StyleSheet,
} = React;

const absoluteStretch = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

module.exports = StyleSheet.create({
  container: {
    ...absoluteStretch,
    justifyContent: 'center',
  },
  menu: {
    flex: 1,
    backgroundColor: 'transparent',
    ...absoluteStretch,
  },
  frontView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  overlay: {
    ...absoluteStretch,
    backgroundColor: 'transparent',
  },
});
