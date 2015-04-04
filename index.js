'use strict';

var React = require('react-native');
var window = require('Dimensions').get('window');

var {
  StyleSheet,
  PanResponder,
  LayoutAnimation,
  View,
} = React;

/**
 * Default open menu offset. Describes a size of the amount you can
 * move content view from the left and release without opening it
 * @type {Number}
 */
var openMenuOffset = window.width * 2 / 3;

/**
 * Content view offset in the `hidden` state
 * @type {Number}
 */
var hiddenMenuOffset = 0;

/**
 * Size of the amount you can move content view in the opened menu state and
 * release without menu closing
 * @type {Number}
 */
var barrierForward = window.width / 4;

/**
 * Check if the current gesture offset
 * bigger than allowed offset before opening menu
 * @param  {Number} dx Gesture offset from the left side of the screen
 * @return {Boolean}
 */
function shouldOpenMenu(dx) {
  return dx > barrierForward;
}

var SideMenu = React.createClass({
  /**
   * Default left offset for content view
   * @type {Number}
   */
  _previousLeft: 0,

  /**
   * Current style `left` attribute
   * @type {Number}
   */
  offsetLeft: 0,

  /**
   * By default, menu is hidden
   * @return {Object}
   */
  getInitialState: function () {
    return {
      show: false,
    }
  },

  /**
   * Create pan responder before component render
   * @return {Void}
   */
  componentWillMount: function() {
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });    
  },

  /**
   * Change `left` style attribute
   * Works only if `sideMenu` is a ref to React.Component
   * @return {Void}
   */
  updatePosition: function() {
    this.sideMenu.setNativeProps({ left: this.offsetLeft });
  },

  /**
   * Permission to use responder 
   * @return {Boolean} true
   */
  handleStartShouldSetPanResponder: () => true,

  /**
   * Handler on responder move
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderMove: function(e: Object, gestureState: Object) {
    this.offsetLeft = this._previousLeft + gestureState.dx; 
    
    if(this.offsetLeft > 0) {
      this.updatePosition();
    }
  },

  /**
   * Handler on responder move ending
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderEnd: function(e: Object, gestureState: Object) {
    LayoutAnimation.configureNext(config);
    
    if (shouldOpenMenu(gestureState.dx)) {
      this.offsetLeft = openMenuOffset;
    } else {
      this.offsetLeft = hiddenMenuOffset;
    }

    this.updatePosition();
    this._previousLeft = this.offsetLeft;

    var stateShow = this._previousLeft === 0 ? false : true; 
    this.setState({show: stateShow});
  },

  /**
   * Get content view. This view will be rendered over menu
   * @return {React.Component}
   */
  getContentView: function() {
    return (
      <View 
        style={styles.frontView} 
        ref={(sideMenu) => this.sideMenu = sideMenu}
        {...this.responder.panHandlers}>

        {React.addons.cloneWithProps(this.props.children, {
           ref: (sideMenu) => this.sideMenu = sideMenu
        })}
      </View>
    );
  },

  /**
   * Get menu view. This view will be rendered under content view
   * @return {React.Component}
   */
  getMenuView: function() {
    return (
      <View style={styles.menu}>
        {this.props.menu}
      </View>
    );
  },

  /**
   * Compose and render menu and content view
   * @return {React.Component}
   */
  render: function() {
    return (
      <View style={styles.container}>
        {this.getMenuView()}
        {this.getContentView()}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    flex: 1,
    backgroundColor: "transparent",
    position: 'absolute',
    top: 0,
    left: 0,
  },
  frontView: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: "#ffffff",
    width: window.width,
    height: window.height,
  }
});

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
      },
    },
  },
};


var layoutAnimationConfigs = [
  animations.layout.spring,
  animations.layout.easeInEaseOut,
];

var config = layoutAnimationConfigs[0];

module.exports = SideMenu;