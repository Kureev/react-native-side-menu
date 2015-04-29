/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SideMenu = require('react-native-side-menu');
var window = require('Dimensions').get('window');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} = React;

var Menu = React.createClass({
  render: function() {
    return (
      <ScrollView style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'http://pickaface.net/includes/themes/clean/img/slide2.png'
            }}/>
          <Text style={{ position: 'absolute', left: 70, top: 20 }}>Your name</Text>
        </View>

        <Text style={styles.item}>About</Text>
        <Text style={styles.item}>Contacts</Text>
      </ScrollView>
    );
  }
});

var simple = React.createClass({
  render: function() {
    return (
      <SideMenu menu={<Menu />}>
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
      </SideMenu>
    );
  }
});

var styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
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

AppRegistry.registerComponent('simple', () => simple);
