const styles = require('./styles');
const queueAnimation = require('./animations');
const React = require('react-native');
const { Dimensions, } = React;
const deviceScreen = Dimensions.get('window');

const {
  PanResponder,
  View,
  TouchableWithoutFeedback,
  Component,
} = React;

/**
 * Default open menu offset. Describes a size of the amount you can
 * move content view from the left and release without opening it
 * @type {Number}
 */
const openMenuOffset = deviceScreen.width * 2 / 3;

/**
 * Content view offset in the `hidden` state
 * @type {Number}
 */
const hiddenMenuOffset = 0;

/**
 * Size of the amount you can move content view in the opened menu state and
 * release without menu closing
 * @type {Number}
 */
const barrierForward = deviceScreen.width / 4;

/**
 * Check if the current gesture offset bigger than allowed one
 * before opening menu
 * @param  {Number} dx Gesture offset from the left side of the window
 * @return {Boolean}
 */
function shouldOpenMenu(dx: Number) {
  return dx > barrierForward;
}

class SideMenu extends Component {
  constructor(props) {
    super(props);
    /**
     * Current state of the menu, whether it is open or not
     * @type {Boolean}
     */
    this.isOpen = false;

    /**
     * Current style `left` attribute
     * @todo Check if it's possible to avoid using `left`
     * @type {Number}
     */
    this.left = 0;

    /**
     * Default left offset for content view
     * @todo Check if it's possible to avoid using `prevLeft`
     * @type {Number}
     */
    this.prevLeft = 0;
  }


  /**
   * Set the initial responders
   * @return {Void}
   */
  componentWillMount() {
    this.responder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
    });
  }

  /**
   * Change `left` style attribute
   * Works only if `sideMenu` is a ref to React.Component
   * @return {Void}
   */
  updatePosition() {
    this.sideMenu.setNativeProps({ left: this.left, });
  }

  /**
   * Determines if gestures are enabled, based off of disableGestures prop
   * @return {Boolean}
   */
  gesturesAreEnabled() {
    let { disableGestures, } = this.props;

    if (typeof disableGestures === 'function') {
      return !disableGestures();
    } else {
      return !disableGestures;
    }
  }

  /**
   * Permission to use responder
   * @return {Boolean}
   */
  handleMoveShouldSetPanResponder(e: Object, gestureState: Object) {
    if (this.gesturesAreEnabled()) {
      const x = Math.round(Math.abs(gestureState.dx));
      const y = Math.round(Math.abs(gestureState.dy));

      return x > this.props.toleranceX && y < this.props.toleranceY;
    } else {
      return false;
    }
  }

  /**
   * Handler on responder move
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderMove(e: Object, gestureState: Object) {
    this.left = this.prevLeft + gestureState.dx;

    if ((this.menuPositionMultiplier() * this.left) > 0) {
      this.updatePosition();
    }
  }

  /**
   * Returns 1 or -1 depending on the menuPosition
   * @return {Number}
   */
  menuPositionMultiplier() {
    return this.props.menuPosition === 'right' ? -1 : 1;
  }

  /**
   * Open menu
   * @return {Void}
   */
  openMenu() {
    queueAnimation(this.props.animation);

    this.left = this.menuPositionMultiplier() *
      (this.props.openMenuOffset || openMenuOffset);

    this.updatePosition();
    this.prevLeft = this.left;

    if (!this.isOpen) {
      this.props.onChange(this.isOpen);

      this.isOpen = true;

      // Force update to make the overlay appear (if touchToClose is set)
      if (this.props.touchToClose) {
        this.forceUpdate();
      }
    }
  }

  /**
   * Close menu
   * @return {Void}
   */
  closeMenu() {
    queueAnimation(this.props.animation);
    this.left = this.menuPositionMultiplier() *
      (this.props.hiddenMenuOffset || hiddenMenuOffset);

    this.updatePosition();
    this.prevLeft = this.left;

    if (this.isOpen) {
      this.props.onChange(this.isOpen);

      this.isOpen = false;
      // Force update to make the overlay disappear (if touchToClose is set)
      if (this.props.touchToClose) {
        this.forceUpdate();
      }
    }
  }

  /**
   * Toggle menu
   * @return {Void}
   */
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Handler on responder move ending
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderEnd(e: Object, gestureState: Object) {
    const shouldOpen = this.menuPositionMultiplier() *
      (this.left + gestureState.dx);

    if (shouldOpenMenu(shouldOpen)) {
      this.openMenu();
    } else {
      this.closeMenu();
    }

    this.updatePosition();
    this.prevLeft = this.left;
  }

  handleOverlayPress(e: Object) {
    this.closeMenu();
  }

  /**
   * Get content view. This view will be rendered over menu
   * @return {React.Component}
   */
  getContentView() {
    const menuActions = this.getMenuActions();

    let overlay = null;

    if (this.isOpen && this.props.touchToClose) {
      overlay = (
        <TouchableWithoutFeedback onPress={this.handleOverlayPress.bind(this)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      );
    }

    const children = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, { menuActions, }));

    return (
      <View
        style={styles.frontView}
        ref={(sideMenu) => this.sideMenu = sideMenu}
        {...this.responder.panHandlers}>
        {children}
        {overlay}
      </View>
    );
  }

  /**
   * Get menu actions to expose it to
   * menu and children components
   * @return {Object} Public API methods
   */
  getMenuActions() {
    return {
      close: this.closeMenu.bind(this),
      toggle: this.toggleMenu.bind(this),
      open: this.openMenu.bind(this),
    };
  }

  /**
   * Get menu view. This view will be rendered under
   * content view. Also, this function will decorate
   * passed `menu` component with side menu API
   * @return {React.Component}
   */
  getMenuView() {
    const menuActions = this.getMenuActions();

    return (
      <View style={styles.menu}>
        {React.addons.cloneWithProps(this.props.menu, { menuActions, })}
      </View>
    );
  }

  /**
   * Compose and render menu and content view
   * @return {React.Component}
   */
  render() {
    return (
      <View style={styles.container}>
        {this.getMenuView()}
        {this.getContentView()}
      </View>
    );
  }
}

SideMenu.propTypes = {
  toleranceX: React.PropTypes.number,
  toleranceY: React.PropTypes.number,
  onChange: React.PropTypes.func,
  touchToClose: React.PropTypes.bool,
  disableGestures: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool]),
};

SideMenu.defaultProps = {
  toleranceY: 10,
  toleranceX: 10,
  onChange: () => ({}),
  touchToClose: false,
};

module.exports = SideMenu;
