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
function shouldOpenMenu(dx: Number, vx: Number, velocityThreshold: Number = null) {
  if (velocityThreshold !== null && Math.abs(vx) > velocityThreshold) {
    return vx > 0;
  }

  return dx > barrierForward;
}

class SideMenu extends Component {
  constructor(props) {
    super(props);

    /**
     * Default left offset for content view
     * @todo Check if it's possible to avoid using `prevLeft`
     * @type {Number}
     */
    this.prevLeft = 0;
    this.isOpen = props.isOpen;

    this.state = {
      width: deviceScreen.width,
      height: deviceScreen.height,
      left: new Animated.Value(
        props.isOpen ? props.openMenuOffset : props.hiddenMenuOffset
      ),
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

  componentWillReceiveProps(props) {
    if (this.isOpen !== props.isOpen) {
      this.openMenu(props.isOpen);
    }
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
      }

      const withinEdgeHitWidth = this.props.menuPosition === 'right' ?
        gestureState.moveX > (deviceScreen.width - this.props.edgeHitWidth) :
        gestureState.moveX < this.props.edgeHitWidth;

      const swipingToOpen = this.menuPositionMultiplier() * gestureState.dx > 0;
      return withinEdgeHitWidth && touchMoved && swipingToOpen;
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
    if (this.state.left.__getValue() * this.menuPositionMultiplier() >= 0) {
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
    const offsetLeft = this.menuPositionMultiplier() *
      (this.state.left.__getValue() + gestureState.dx);

    this.openMenu(shouldOpenMenu(offsetLeft, gestureState.vx, this.props.velocityThreshold), gestureState.vx);
  }

  /**
   * Returns 1 or -1 depending on the menuPosition
   * @return {Number}
   */
  menuPositionMultiplier() {
    return this.props.menuPosition === 'right' ? -1 : 1;
  }

  moveLeft(offset, velocity = null) {
    const newOffset = this.menuPositionMultiplier() * offset;

    this.props
      .animationFunction(this.state.left, newOffset, velocity)
      .start();

    this.prevLeft = newOffset;
  }

  /**
   * Toggle menu
   * @return {Void}
   */
  openMenu(isOpen, velocity = null) {
    const { hiddenMenuOffset, openMenuOffset, } = this.props;
    this.moveLeft(isOpen ? openMenuOffset : hiddenMenuOffset, velocity);
    this.isOpen = isOpen;

    this.forceUpdate();
    this.props.onChange(isOpen);
  }

  /**
   * Get content view. This view will be rendered over menu
   * @return {React.Component}
   */
  getContentView() {
    let overlay = null;

    if (this.isOpen) {
      overlay = (
        <TouchableWithoutFeedback onPress={() => this.openMenu(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      );
    }

    const { width, height, } = this.state;
    const ref = (sideMenu) => this.sideMenu = sideMenu;
    const style = [
      styles.frontView,
      { width, height, },
      this.props.animationStyle(this.state.left),
    ];

    return (
      <Animated.View style={style} ref={ref} {...this.responder.panHandlers}>
        {this.props.children}
        {overlay}
      </Animated.View>
    );
  }

  onLayoutChange(e) {
    const { width, height, } = e.nativeEvent.layout;
    this.setState({ width, height, });
  }

  /**
   * Compose and render menu and content view
   * @return {React.Component}
   */
  render() {
    const menu = <View style={styles.menu}>{this.props.menu}</View>;

    return (
      <View style={styles.container} onLayout={this.onLayoutChange.bind(this)}>
        {menu}
        {this.getContentView()}
      </View>
    );
  }
}

SideMenu.propTypes = {
  edgeHitWidth: React.PropTypes.number,
  toleranceX: React.PropTypes.number,
  toleranceY: React.PropTypes.number,
  menuPosition: React.PropTypes.oneOf(['left', 'right', ]),
  onChange: React.PropTypes.func,
  openMenuOffset: React.PropTypes.number,
  hiddenMenuOffset: React.PropTypes.number,
  disableGestures: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool, ]),
  animationFunction: React.PropTypes.func,
  onStartShouldSetResponderCapture: React.PropTypes.func,
  isOpen: React.PropTypes.bool,
  velocityThreshold: React.PropTypes.number,
};

SideMenu.defaultProps = {
  toleranceY: 10,
  toleranceX: 10,
  edgeHitWidth: 60,
  openMenuOffset: deviceScreen.width * 2 / 3,
  hiddenMenuOffset: 0,
  onStartShouldSetResponderCapture: () => true,
  onChange: () => {},
  animationStyle: (value) => {
    return {
      transform: [{
        translateX: value,
      }, ],
    };
  },
  animationFunction: (prop, value, velocity = null) => {
    return Animated.spring(
      prop,
      {
        toValue: value,
        friction: 8,
        velocity,
      }
    );
  },
  isOpen: false,
};

module.exports = SideMenu;
