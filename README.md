## Customizable side menu for react-native
<p align="center">
    <img src ="http://oi61.tinypic.com/2n9l2dz.jpg" />
</p>

### Content
- [Installation](#installation)
- [Usage example](#usage-example)
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

Clicking on any menu item should cause closing menu. It can be done by using `menuActions` which are passed thru props to `menu` component. Example looks like this:

```javascript
var Menu = React.createClass({
  about: function() {
    this.props.menuActions.close();
    this.props.navigator.push({...});
  },

  render: function() {
    return (
      <View>
        <Text>Menu</Text>
        <Text onPress={this.about}>About</Text>
      </View>
    );
  }
});
```

`menuActions` consists of following method(s):
- `close` (Void) - Close menu
- `toggle` (Void) - Toggle menu (close / open)
- `open` (Void) - Open menu

### Component props
- `menu` (React.Component) - Menu component
- `animation` (spring|linear|easeInOut) - Type of slide animation. Default is "linear".
- `openMenuOffset` (Number) - Content view left margin if menu is opened
- `hiddenMenuOffset` (Number) - Content view left margin if menu is hidden

- `disableGestures` (Bool) - Disable whether the menu can be opened with gestures or not

*In progress*

### Special thanks
Creating this component has been inspired by [@khanghoang](https://github.com/khanghoang)'s [RNSideMenu](https://github.com/khanghoang/RNSideMenu) example.

Also, thanks to [@ericvicenti](https://github.com/ericvicenti) for help with figuring out with `setNativeProps`

### Questions?
Feel free to contact me in [twitter](https://twitter.com/kureevalexey) or [create an issue](https://github.com/Kureev/react-native-navbar/issues/new)
