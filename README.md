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

var Menu = React.createClass({
  render: function() {
    return (
      <View>
        <Caption>Menu</Caption>
        <MenuItem>About</MenuItem>
        <MenuItem>Content</MenuItem>
        <MenuItem>Contacts</MenuItem>
      </View>
    );
  }
});

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
    var menu = <Menu />;

    return (
      <SideMenu menu={menu}>
        <ContentView/>
      </SideMenu>
    );
  }
});
```

### Component props
- `menu` (React.Component) - Menu component

*Will be extended soon*

### Special thanks
Creating this component has been inspired by [@khanghoang](https://github.com/khanghoang)'s [RNSideMenu](https://github.com/khanghoang/RNSideMenu) example.

Also, thanks to [@ericvicenti](https://github.com/ericvicenti) for help with figuring out with `setNativeProps`

### Questions?
Feel free to contact me in [twitter](https://twitter.com/kureevalexey) or [create an issue](https://github.com/Kureev/react-native-navbar/issues/new)