'use strict';

var React = require('react-native');
var deviceScreen = require('Dimensions').get('window');
var styles = require('./styles');
var queueAnimation = require('./animations');

var {
  PanResponder,
  View,
} = React;

/**
 * Default open menu offset. Describes a size of the amount you can
 * move content view from the left and release without opening it
 * @type {Number}
 */
var openMenuOffset = deviceScreen.width * 2 / 3;

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
var barrierForward = deviceScreen.width / 4;

/**
 * Check if the current gesture offset bigger than allowed one
 * before opening menu
 * @param  {Number} dx Gesture offset from the left side of the window
 * @return {Boolean}
 */
function shouldOpenMenu(dx: Number) {
  return dx > barrierForward;
}

var SideMenu = React.createClass({
  /**
   * Current style `left` attribute
   * @todo Check if it's possible to avoid using `left`
   * @type {Number}
   */
  left: 0,

  /**
   * Default left offset for content view
   * @todo Check if it's possible to avoid using `prevLeft`
   * @type {Number}
   */
  prevLeft: 0,

  /**
   * Create pan responder before component render
   * @return {Void}
   */
  componentWillMount: function() {
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
    });
  },

  /**
   * Change `left` style attribute
   * Works only if `sideMenu` is a ref to React.Component
   * @return {Void}
   */
  updatePosition: function() {
    this.sideMenu.setNativeProps({ left: this.left });
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
    this.left = this.prevLeft + gestureState.dx;

    if (this.left > 0) {
      this.updatePosition();
    }
  },

  /**
   * Open menu
   * @return {Void}
   */
  openMenu: function() {
    queueAnimation(this.props.animation);
    this.left = this.props.openMenuOffset || openMenuOffset;
    this.updatePosition();
    this.prevLeft = this.left;
  },

  /**
   * Close menu
   * @return {Void}
   */
  closeMenu: function() {
    queueAnimation(this.props.animation);
    this.left = this.props.hiddenMenuOffset || hiddenMenuOffset;
    this.updatePosition();
    this.prevLeft = this.left;
  },

  /**
   * Handler on responder move ending
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderEnd: function(e: Object, gestureState: Object) {
    if (shouldOpenMenu(this.left + gestureState.dx)) {
      this.openMenu();
    } else {
      this.closeMenu();
    }

    this.updatePosition();
    this.prevLeft = this.left;
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

        {this.props.children}
      </View>
    );
  },

  /**
   * Get menu view. This view will be rendered under
   * content view. Also, this function will decorate
   * passed `menu` component with side menu API
   * @return {React.Component}
   */
  getMenuView: function() {
    var menuActions = {
      close: this.closeMenu
    };

    return (
      <View style={styles.menu}>
        {React.addons.cloneWithProps(this.props.menu, { menuActions })}
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

module.exports = SideMenu;