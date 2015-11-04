const styles = require('./styles');
const React = require('react-native');
const { Dimensions, Animated, } = React;
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
     * Default left offset for content view
     * @todo Check if it's possible to avoid using `prevLeft`
     * @type {Number}
     */
    this.prevLeft = 0;

    this.state = {
      left: new Animated.Value(0),
    };
  }

  getChildContext() {
    return {
      menuActions: this.getMenuActions(),
    };
  }

  /**
   * Set the initial responders
   * @return {Void}
   */
  componentWillMount() {
    this.responder = PanResponder.create({
      onStartShouldSetResponderCapture: this.props.onStartShouldSetResponderCapture.bind(this),
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
    });
  }

  /**
   * Determines if gestures are enabled, based off of disableGestures prop
   * @return {Boolean}
   */
  gesturesAreEnabled() {
    let { disableGestures, } = this.props;

    if (typeof disableGestures === 'function') {
      return !disableGestures();
    }

    return !disableGestures;
  }

  /**
   * Permission to use responder
   * @return {Boolean}
   */
  handleMoveShouldSetPanResponder(e: Object, gestureState: Object) {
    if (this.gesturesAreEnabled()) {
      const x = Math.round(Math.abs(gestureState.dx));
      const y = Math.round(Math.abs(gestureState.dy));

      const touchMoved = x > this.props.toleranceX && y < this.props.toleranceY;
      if (this.isOpen) {
        return touchMoved;
      } else {
        const withinEdgeHitWidth = this.props.menuPosition === 'right' ?
            gestureState.moveX > (deviceScreen.width - this.props.edgeHitWidth) :
            gestureState.moveX < this.props.edgeHitWidth;
        const swipingToOpen = (this.menuPositionMultiplier() * gestureState.dx) > 0;
        return withinEdgeHitWidth && touchMoved && swipingToOpen;
      }
    }

    return false;
  }

  /**
   * Handler on responder move
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderMove(e: Object, gestureState: Object) {
    if (this.menuPositionMultiplier() * 
      (this.state.left.__getValue() + gestureState.dx ) >= 0 ) {

      this.state.left.setValue(this.prevLeft + gestureState.dx);
    }
  }

  /**
   * Handler on responder move ending
   * @param  {Synthetic Event} e
   * @param  {Object} gestureState
   * @return {Void}
   */
  handlePanResponderEnd(e: Object, gestureState: Object) {
    const currentLeft = this.state.left.__getValue();

    const shouldOpen = this.menuPositionMultiplier() *
      (currentLeft + gestureState.dx);

    if (shouldOpenMenu(shouldOpen)) {
      this.openMenu();
    } else {
      this.closeMenu();
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
    const openOffset = this.menuPositionMultiplier() *
      (this.props.openMenuOffset || openMenuOffset);

    this.props
      .animationFunction(this.state.left, openOffset)
      .start();

    this.prevLeft = openOffset;

    if (!this.isOpen) {
      this.isOpen = true;
      this.props.onChange(this.isOpen);

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
    const closeOffset = this.menuPositionMultiplier() *
      (this.props.hiddenMenuOffset || hiddenMenuOffset);

    this.props
      .animationFunction(this.state.left, closeOffset)
      .start();

    this.prevLeft = closeOffset;

    if (this.isOpen) {
      this.isOpen = false;
      this.props.onChange(this.isOpen);

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
   * Get content view. This view will be rendered over menu
   * @return {React.Component}
   */
  getContentView() {
    let overlay = null;

    if (this.isOpen && this.props.touchToClose) {
      overlay = (
        <TouchableWithoutFeedback onPress={this.closeMenu.bind(this)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      );
    }

    const {width, height} = this.state;

    return (
      <Animated.View
        style={[styles.frontView, {width, height}, this.props.animationStyle(this.state.left), ]}
        ref={(sideMenu) => this.sideMenu = sideMenu}
        {...this.responder.panHandlers}>
        {this.props.children}
        {overlay}
      </Animated.View>
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

  onLayoutChange(e) {
    const {width, height} = e.nativeEvent.layout;
    this.setState({width, height});
  }

  /**
   * Compose and render menu and content view
   * @return {React.Component}
   */
  render() {
    return (
      <View style={styles.container} onLayout={this.onLayoutChange.bind(this)}>
        <View style={styles.menu}>
          {this.props.menu}
        </View>
        {this.getContentView()}
      </View>
    );
  }
}

SideMenu.childContextTypes = {
  menuActions: React.PropTypes.object.isRequired,
};

SideMenu.propTypes = {
  edgeHitWidth: React.PropTypes.number,
  toleranceX: React.PropTypes.number,
  toleranceY: React.PropTypes.number,
  menuPosition: React.PropTypes.oneOf(['left', 'right']),
  onChange: React.PropTypes.func,
  touchToClose: React.PropTypes.bool,
  disableGestures: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool, ]),
  animationFunction: React.PropTypes.func,
  onStartShouldSetResponderCapture: React.PropTypes.func,
};

SideMenu.defaultProps = {
  toleranceY: 10,
  toleranceX: 10,
  edgeHitWidth: 60,
  touchToClose: false,
  onStartShouldSetResponderCapture: () => true,
  onChange: () => {},
  animationStyle: (value) => {
    return {
      transform: [{
        translateX: value,
      }, ],
    };
  },
  animationFunction: (prop, value) => {
    return Animated.spring(
      prop,
      {
        toValue: value,
        friction: 8,
      }
    );
  },
};

module.exports = SideMenu;
