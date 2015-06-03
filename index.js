'use strict';

var React = require('react-native');
var deviceScreen = require('Dimensions').get('window');
var styles = require('./styles');
var queueAnimation = require('./animations');

var {
  PanResponder,
  View,
  TouchableWithoutFeedback
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

/**
 * no operation function. does nothing.
 */
function noop() {}

var SideMenu = React.createClass({

  /**
   * Current state of the menu, whether it is open or not
   * @type {Boolean}
   */
  isOpen: false,

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
   * Creates PanResponders and links to appropriate functions
   * @return {Void}
   */
  createResponders: function(disableGestures) {
    if (disableGestures || false) {
      this.responder = PanResponder.create({});
      return;
    }

    this.responder = PanResponder.create({
        onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
        onPanResponderMove: this.handlePanResponderMove,
        onPanResponderRelease: this.handlePanResponderEnd,
    });
  },

  /**
   * Set the initial responders
   * @return {Void}
   */
  componentWillMount: function () {
    this.createResponders(this.props.disableGestures);
  },

  /**
   * Update responders on new props whenever possible
   * @return {Void}
   */
  componentWillReceiveProps: function (nextProps) {
    this.createResponders(nextProps.disableGestures);
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
  handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object) {
    var x = Math.round(Math.abs(gestureState.dx));
    var y = Math.round(Math.abs(gestureState.dy));

    return x > this.props.toleranceX && y < this.props.toleranceY;
  },

  /**
   * Handler on responder move
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderMove: function(e: Object, gestureState: Object) {
    this.left = this.prevLeft + gestureState.dx;

    if ((this.menuPositionMultiplier() * this.left) > 0) {
      this.updatePosition();
    }
  },

  /**
   * Returns 1 or -1 depending on the menuPosition
   * @return {Number}
   */
  menuPositionMultiplier: function() {
    return this.props.menuPosition === "right" ? -1 : 1;
  },

  /**
   * Open menu
   * @return {Void}
   */
  openMenu: function() {
    queueAnimation(this.props.animation);

    this.left = this.menuPositionMultiplier() *
      (this.props.openMenuOffset || openMenuOffset);

    this.updatePosition();
    this.prevLeft = this.left;

    if (!this.isOpen) {
      this.props.onChange(this.isOpen);
      // Force update to make the overlay appear (if touchToClose is set)
      this.props.touchToClose && this.forceUpdate();
    }

    this.isOpen = true;
  },

  /**
   * Close menu
   * @return {Void}
   */
  closeMenu: function() {
    queueAnimation(this.props.animation);
    this.left = this.menuPositionMultiplier() *
      (this.props.hiddenMenuOffset || hiddenMenuOffset);

    this.updatePosition();
    this.prevLeft = this.left;

    if (this.isOpen) {
      this.props.onChange(this.isOpen);
      // Force update to make the overlay disappear (if touchToClose is set)
      this.props.touchToClose && this.forceUpdate();
    }

    this.isOpen = false;
  },

  /**
   * Toggle menu
   * @return {Void}
   */
  toggleMenu: function() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },

  /**
   * Handler on responder move ending
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderEnd: function(e: Object, gestureState: Object) {
    var shouldOpen = this.menuPositionMultiplier() *
      (this.left + gestureState.dx);

    if (shouldOpenMenu(shouldOpen)) {
      this.openMenu();
    } else {
      this.closeMenu();
    }

    this.updatePosition();
    this.prevLeft = this.left;
  },

  handleOverlayPress: function(e: Object) {
    this.closeMenu();
  },

  /**
   * Get content view. This view will be rendered over menu
   * @return {React.Component}
   */
  getContentView: function() {
    var getMenuActions = this.getMenuActions();

    var overlay = null;

    if (this.isOpen && this.props.touchToClose) {
      overlay = (
        <TouchableWithoutFeedback onPress={this.handleOverlayPress}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      );
    }

    var children = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {
        menuActions: getMenuActions
      });
    });

    return (
      <View
        style={styles.frontView}
        ref={(sideMenu) => this.sideMenu = sideMenu}
        {...this.responder.panHandlers}>
        {children}
        {overlay}
      </View>
    );
  },

  /**
   * Get menu actions to expose it to
   * menu and children components
   * @return {Object} Public API methods
   */
  getMenuActions: function() {
    return {
      close: this.closeMenu,
      toggle: this.toggleMenu,
      open: this.openMenu
    };
  },

  /**
   * Get menu view. This view will be rendered under
   * content view. Also, this function will decorate
   * passed `menu` component with side menu API
   * @return {React.Component}
   */
  getMenuView: function() {
    var menuActions = this.getMenuActions();

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

SideMenu.propTypes = {
  toleranceX: React.PropTypes.number,
  toleranceY: React.PropTypes.number,
  onChange: React.PropTypes.func,
  touchToClose: React.PropTypes.bool
}

SideMenu.defaultProps = {
  toleranceY: 10,
  toleranceX: 10,
  onChange: noop,
  touchToClose: false
};

module.exports = SideMenu;
