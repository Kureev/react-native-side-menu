## Customizable side menu for react-native
<p align="center">
  <img src ="http://oi61.tinypic.com/2n9l2dz.jpg" />
</p>

### Content
- [Installation](#installation)
- [Usage example](#usage-example)
- [Component props](#component-props)
- [Questions?](#questions)

### Installation
```bash
npm install react-native-side-menu
```

### Usage example
```javascript
const SideMenu = require('react-native-side-menu');

class ContentView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onMenuButtonPress}>  
          <Text>Open menu</Text>
        </TouchableOpacity>
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
}

class Application extends React.Component {
  state = {
    isOpen: false,
  };

  closeMenu() {
    this.setState({ isOpen: false });
  }

  toggleMenu() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const menu = <Menu navigator={navigator} />;

    return (
      <SideMenu
        menu={menu}
        onContentPress={() => this.closeMenu()}>
        <ContentView onMenuButtonPress={() => this.toggleMenu()}/>
      </SideMenu>
    );
  }
}
```

### Component props
- `menu` (React.Component) - Menu component
- `isOpen` (Boolean) - Props driven control over menu open state
- `openMenuOffset` (Number) - Content view left margin if menu is opened, defaults to 2/3 of device screen width
- `hiddenMenuOffset` (Number) - Content view left margin if menu is hidden
- `edgeHitWidth` (Number) - Edge distance on content view to open side menu, defaults to 60
- `toleranceX` (Number) - X axis tolerance
- `toleranceY` (Number) - Y axis tolerance
- `onSwipe` (Function) - Function that handles gestures, receives boolean argument indicating whether menu should be opened or not based on the drag. When not defined, gestures are disabled
- `onStartShouldSetResponderCapture` (Function) - Function that accepts event as an argument and specify if side-menu should react on the touch or not. Check https://facebook.github.io/react-native/docs/gesture-responder-system.html for more details. Typically you would like to set `isOpen` value to the passed argument (see examples/Basic.js)
- `onContentPress` (Function) - Function that handles content press when menu is opened. Typically you would set isOpen to false inside it (see examples/Basic.js). When not present, content is accessible when menu is opened and there's no `touchToClose` behavior
- `menuPosition` (String) - either 'left' or 'right', defaults to 'left'
- `animationFunction` (Function -> Object) - Function that accept 2 arguments (prop, value) and return an object:
  - `prop` you should use at the place you specify parameter to animate
  - `value` you should use to specify the final value of `prop`
- `animationStyle` (Function -> Object) - Function that accept 1 argument (value) and return an object:
  - `value` you should use at the place you need current value of animated parameter (left offset of content view)

### Questions?
Feel free to contact me in [twitter](https://twitter.com/kureevalexey) or [create an issue](https://github.com/Kureev/react-native-side-menu/issues/new)
