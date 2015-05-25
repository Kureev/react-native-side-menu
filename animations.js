var LayoutAnimation = require('react-native').LayoutAnimation;
var DEFAULT_ANIMATION = 'linear';

var animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
        property: LayoutAnimation.Properties.opacity,
      },
    },
    linear: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        springDamping: 0.7,
        property: LayoutAnimation.Properties.opacity,
      },
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    },
  },
};

var layoutAnimationConfigs = {
  'spring': animations.layout.spring,
  'linear': animations.layout.linear,
  'easeInOut': animations.layout.easeInEaseOut,
};

module.exports = function(animation) {
  var _animation = layoutAnimationConfigs[animation];
  if (!_animation) {
    _animation = layoutAnimationConfigs[DEFAULT_ANIMATION];
  }
  
  LayoutAnimation.configureNext(_animation);
}
