import React, {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Navigator
} from 'react-native';

const SideMenu = require('react-native-side-menu');

const styles = StyleSheet.create({
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

const ContentView = React.createClass({
    render() {
        return <Navigator
            initialRoute={{ component: HomeView }}
            renderScene={this.renderScene}
            ref={"navigator"}
            />
    },
    renderScene(route, navigator) {
        return <route.component navigator={navigator} />
    }
})

const HomeView = React.createClass({
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
                    Press Cmd+R to reload, {'\n'}
                    Cmd+Control+Z for dev menu
                </Text>
            </View>
        );
    }
})

const AboutView = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    This is the About View
                </Text>
            </View>
        );
    }
})

const MenuView = React.createClass({
    openHomeView() {
        this.props.changeView(HomeView)
    },
    openAboutView() {
        this.props.changeView(AboutView)
    },
    render() {
        return (
            <View>
                <View style={{ margin:50 }}>
                    <TouchableHighlight onPress={this.openHomeView}>
                        <Text>Home</Text>
                    </TouchableHighlight>
                </View>
                <View style={{ marginLeft:50 }}>
                    <TouchableHighlight onPress={this.openAboutView}>
                        <Text>About</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
})

const Main = React.createClass({
    changeView(componentView) {
        this.refs.contentView.refs.navigator.push({ component: componentView })
        this.setState({
            isOpen: false
        });
    },
    render() {
        const menu = <MenuView changeView={this.changeView}/>;
        return (
            <SideMenu menu={menu} ref={"sideMenu"}>
                <ContentView ref={"contentView"}/>
            </SideMenu>
        );
    }
})

module.exports = Main;