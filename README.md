## Customizable side menu for react-native
<p align="center">
    <img src ="http://oi61.tinypic.com/2n9l2dz.jpg" />
</p>

### Content
- [Installation](#installation)
- [Usage example](#usage-example)
- [Managing menu state](#managing-menu-state)
- [Component props](#component-props)
- [Special thanks](#special-thanks)
- [Questions?](#questions)

### Installation
```bash
npm install react-native-side-menu
```

### Usage example
```javascript
var SideMenu = require('react-native-side-menu');

var ContentView = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
});

var Application = React.createClass({
  render: function() {
    var menu = <Menu navigator={navigator}/>;

    return (
      <SideMenu menu={menu}>
        <ContentView/>
      </SideMenu>
    );
  }
});
```
### Managing menu state
Managing menu state works thru the exposed `menuActions`. To access `menuActions`, you need to use context. (there is an [awesome article](https://www.tildedave.com/2014/11/15/introduction-to-contexts-in-react-js.html) for that).

`menuActions` consists of following method(s):
- `close` (Void) - Close menu
- `toggle` (Void) - Toggle menu (close / open)
- `open` (Void) - Open menu

Usage example:
```javascript
class Button extends Component {
  handlePress(e) {
    this.context.menuActions.toggle();
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}>
        <Text style={this.props.style}>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

/**
 * This part is very important. Without it you wouldn't be able to access `menuActions`
 * @type {Object}
 */
Button.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};
```

### Component props
- `menu` (React.Component) - Menu component
- `openMenuOffset` (Number) - Content view left margin if menu is opened, defaults to 2/3 of device screen width.
- `hiddenMenuOffset` (Number) - Content view left margin if menu is hidden
- `edgeHitWidth` (Number) - Edge distance on content view to open side menu
- `toleranceX` (Number) - X axis tolerance
- `toleranceY` (Number) - Y axis tolerance
- `disableGestures` (Bool) - Disable whether the menu can be opened with gestures or not
- `onStartShouldSetResponderCapture` (Function) - Function that accepts event as an argument and specify if side-menu should react on the touch or not. Check https://facebook.github.io/react-native/docs/gesture-responder-system.html for more details.
- `onChange` (Function) - Callback on menu open/close. Is passed `isOpen` as an argument
- `menuPosition` (String) - either 'left' or 'right', defaults to 'left'
- `animationFunction` (Function -> Object) - Function that accept 2 arguments (prop, value) and return an object:
  - `prop` you should use at the place you specify parameter to animate;
  - `value` you should use to specify the final value of `prop`;
- `animationStyle` (Function -> Object) - Function that accept 1 argument (value) and return an object:
  - `value` you should use at the place you need current value of animated parameter (left offset of content view)
- `touchToClose` (Bool) - Allows for touching the partially hidden view to close the menu. Defaults to `false`.

*In progress*

### Special thanks
Creating this component has been inspired by [@khanghoang](https://github.com/khanghoang)'s [RNSideMenu](https://github.com/khanghoang/RNSideMenu) example.

Also, thanks to [@ericvicenti](https://github.com/ericvicenti) for help with figuring out with `setNativeProps`

### Questions?
Feel free to contact me in [twitter](https://twitter.com/kureevalexey) or [create an issue](https://github.com/Kureev/react-native-side-menu/issues/new)
