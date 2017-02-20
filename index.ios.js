import React, {Component} from 'react';
import {
    Text,
    Navigator,
    TouchableHighlight,
    AppRegistry,
    StyleSheet,
    AsyncStorage,
    View
} from 'react-native';
import List from './src/components/List';
import Login from './src/components/Login';
import Register from './src/components/Register';
import Preloader from './src/components/Preloader';
import RestClient from './src/RestClient';

const domain = 'http://react.ezstudiodemo.com',
      username = 'admin',
      password = 'publish',
      styles = StyleSheet.create({
      container: {
          paddingTop: 75
      },
      navbar: {
          marginTop: 15,
          marginLeft: 10,
          marginRight: 10
      },
      navbarTitle: {
          color: '#444',
          fontSize: 16,
          fontWeight: '500'
      },
      navbarTitlePrimary: {
          color: '#337ab7'
      },
      userTitle: {
          textAlign: 'center',
          fontSize: 10,
          color: '#424242',
          fontWeight: 'bold'
      }
  });

export default class PlacesAndTastes extends Component {
    routes = [
        {index: 'list'},
        {index: 'login'},
        {index: 'register'},
        {index: 'preloader'}
    ];

    constructor(props) {
        super(props);

        this.state = {
            userTitle: ''
        };

        this.restClient = new RestClient({
            domain: domain
        });

        this.restClient.generateSession(
            username,
            password,
            (results) => {
                AsyncStorage.multiSet([
                    ['identifier', results['Session']['identifier']],
                    ['csrfToken', results['Session']['csrfToken']],
                    ['User', results['Session']['User']['_href']]
                ]);
            });
    }

    componentWillUnmount() {
        this.restClient.destroySession();
    }

    renderScene(route, navigator) {
        if (route.index === 'login') {
            return (<Login
                        restClient={this.restClient}
                        navigator={navigator}
                    />);
        }

        if (route.index === 'register') {
            return (<Register
                        restClient={this.restClient}
                        navigator={navigator}
                    />);
        }

        if (route.index == 'preloader') {
            return (<Preloader
                        navigator={navigator}
                    />);
        }

        return (<List
                    restClient={this.restClient}
                    domain={domain}
                />);
    }

    render() {
        return (
            <Navigator
                initialRoute={this.routes[0]}
                initialRouteStack={this.routes}
                renderScene={this.renderScene.bind(this)}
                configureScene={(route, routeStack) =>
                    Navigator.SceneConfigs.FloatFromLeft
                }
                navigationBar={
                     <Navigator.NavigationBar
                       routeMapper={{
                         LeftButton: (route, navigator, index, navState) => {
                            if (route.index !== 'list' && route.index !== 'preloader') {
                                return (<Text onPress={() => navigator.pop()}>Back</Text>);
                            }
                         },
                         RightButton: (route, navigator, index, navState) => {
                            if (route.index === 'list') {
                                return (<Text onPress={() => navigator.push({index: 'login'})}>Login</Text>);
                            } else if (route.index === 'login') {
                                return (<Text onPress={() => navigator.push({index: 'register'})}>Register</Text>);
                            }
                         },
                         Title: (route, navigator, index, navState) => {
                             return (
                                 <View>
                                     <Text style={styles.navbarTitle}>Tasteful <Text style={styles.navbarTitlePrimary}>Planet</Text></Text>
                                     <Text style={styles.userTitle}>{this.restClient.defaultUserTitle}</Text>
                                 </View>
                             );
                         }
                       }}
                       style={styles.navbar}
                     />
                }
                style={styles.container}
            />
        );
    }
}

AppRegistry.registerComponent('PlacesAndTastes', () => PlacesAndTastes);
