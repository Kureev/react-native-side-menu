Object.defineProperty(exports, '__esModule', {value: true});
var _extends =
  Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
var _reactNative = require('react-native');
var absoluteStretch = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};
exports.default = _reactNative.StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  menu: _extends({}, absoluteStretch),
  frontView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  overlay: _extends({}, absoluteStretch, {backgroundColor: 'transparent'}),
});
