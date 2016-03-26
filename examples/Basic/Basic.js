const React = require('react-native');
const SideMenu = require('../../');
const Menu = require('./Menu');

const {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Component,
} = React;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class Button extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

module.exports = class Basic extends Component {
  state = {
    isOpen: false,
    selectedItem: 'About',
  };
  skippedElements = [];

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onMenuItemSelected = (item) => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }

  render() {
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}
        ref={(ref)=> {if (ref !== null) ref.skippedElements = this.skippedElements;}}>
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
          <Text style={styles.instructions}>
            Current selected menu item is: {this.state.selectedItem}
          </Text>
          <Text
            ref={(ref)=> { if (ref && this.skippedElements && this.skippedElements.indexOf(ref._reactInternalInstance._rootNodeID) == -1) this.skippedElements.push(ref._reactInternalInstance._rootNodeID);}}
            style={[styles.instructions, {borderWidth: 1, marginTop: 30}]}>
            And this is an example of element (TEXT element to be honest), which
            will not respond to any swipes to show the menu back. It should, because
            `props.edgeHitWidth` is set to `deviceScreen.width`, but it won't :) Sometimes
            it may be really usefull, for example, in horizontal scroll views.
          </Text>
        </View>
        <Button style={styles.button} onPress={() => this.toggle()}>
          <Image
            source={{ uri: 'http://i.imgur.com/vKRaKDX.png', width: 32, height: 32, }} />
        </Button>
      </SideMenu>
    );
  }
};
