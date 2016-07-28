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
npm install react-native-side-menu --save
```

### Usage example
```javascript
const SideMenu = require('react-native-side-menu');

class ContentView extends React.Component {
  render() {
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
}

class Application extends React.Component {
  render() {
    const menu = <Menu navigator={navigator}/>;

    return (
      <SideMenu menu={menu}>
        <ContentView/>
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
- `disableGestures` (Bool) - Disable whether the menu can be opened with gestures or not
- `onStartShouldSetResponderCapture` (Function) - Function that accepts event as an argument and specify if side-menu should react on the touch or not. Check https://facebook.github.io/react-native/docs/gesture-responder-system.html for more details
- `onChange` (Function) - Callback on menu open/close. Is passed `isOpen` as an argument
- `onMove` (Function) - Callback on menu move. Is passed `left` as an argument
- `menuPosition` (String) - either 'left' or 'right', defaults to 'left'
- `animationFunction` (Function -> Object) - Function that accept 2 arguments (prop, value) and return an object:
  - `prop` you should use at the place you specify parameter to animate
  - `value` you should use to specify the final value of `prop`
- `animationStyle` (Function -> Object) - Function that accept 1 argument (value) and return an object:
  - `value` you should use at the place you need current value of animated parameter (left offset of content view)
- `bounceBackOnOverdraw` - when true, content view will bounce back to `openMenuOffset` when dragged further, defaults to true

### FAQ

#### ScrollView does not scroll to top on status bar press

On iPhone, the scroll-to-top gesture has no effect if there is more than one scroll view on-screen that has scrollsToTop set to true. Since it defaults to `true` in ReactNative, you have to set `scrollsToTop={false}` on your ScrollView inside `Menu` component in order to get it working as desired.

### Questions?
Feel free to contact me in [twitter](https://twitter.com/kureevalexey) or [create an issue](https://github.com/Kureev/react-native-side-menu/issues/new)
