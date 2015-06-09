## Getting started

### Install from git
First of all, clone repo to your computer
```bash
$ git clone https://github.com/Kureev/react-native-side-menu.git
```
Then install all dependencies
```bash
$ npm install
```
And now we're ready to run!

### Create project manually
First of all, install `react-native` generator from the `npm`:
```bash
$ npm install react-native -g
```

*Note: in some cases you need to use `sudo` for that*

After generater is installed, you can init your project:
```bash
$ react-native init <ProjectName>
```

It'll scaffold you a sample project. Go to it and install `react-native-side-menu`:
```bash
$ npm i react-native-side-menu --save
```

Now you have everything to implement side menu in your app!

## About
This example demonstrate a simple left-sided side menu. When you tap on the content view (it's a top view layer) and swipe your finger to the right, you'll see a menu under. All you need to enable side menu is to wrap your content view (I'll wrap a default scaffolded view) with it and specify menu view (required property):
```javascript
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
```

## View hierarchy
<img src='http://s18.postimg.org/ylhjd2yy1/example.png' alt="React native side menu simple example"/>
