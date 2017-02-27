import React, {Component} from 'react';
import {
    Text,
    Navigator,
    AppRegistry,
    StyleSheet,
    AsyncStorage,
    View
} from 'react-native';
import List from './src/components/List';
import Settings from './src/components/Settings';
import Register from './src/components/Register';
import Preloader from './src/components/Preloader';
import SettingsPreview from './src/components/SettingsPreview';
import Photographer from './src/components/Photographer';
import RestClient from './src/RestClient';
import Configuration from './src/Configuration';
import SettingsSVG from './src/svg/SettingsSVG';

const styles = StyleSheet.create({
      container: {
          paddingTop: 75
      },
      navbar: {
          marginTop: 15,
          marginLeft: 10,
          marginRight: 10
      },
      navbarListTitle: {
          color: '#444',
          fontSize: 16,
          fontWeight: '500'
      },
      navbarTitlePrimary: {
          color: '#337ab7'
      },
      navbarTitle: {
          marginTop: 7,
          fontWeight: 'bold',
          color: '#424242'
      },
      userTitle: {
          textAlign: 'center',
          fontSize: 10,
          color: '#424242',
          fontWeight: 'bold'
      },
      direction: {
          marginTop: 8,
          fontSize: 13,
          fontWeight: 'bold',
          color: '#2184fc'
      },
      icon: {
          marginTop: 10
      }
  });

export default class PlacesAndTastes extends Component {
    routes = [
        {index: 'list'},
        {index: 'settings_preview'},
        {index: 'settings'},
        {index: 'register'},
        {index: 'preloader'},
        {index: 'photographer'}
    ];

    constructor(props) {
        super(props);

        this.state = {
            userTitle: ''
        };

        this.restClient = new RestClient();
        this.restClient.generateSession(
            Configuration.getDomain(),
            Configuration.getUsername(),
            Configuration.getPassword(),
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
        switch (route.index) {
            case 'settings_preview':
                return (<SettingsPreview/>);
                break;

            case 'settings':
                return (<Settings
                    restClient={this.restClient}
                    navigator={navigator}
                />);
                break;

            case 'register':
                return (<Register
                    restClient={this.restClient}
                    navigator={navigator}
                />);
                break;

            case 'preloader':
                return (<Preloader
                    navigator={navigator}
                />);
                break;

            case 'photographer':
                return (<Photographer/>);
                break;

            default:
                return (<List
                    restClient={this.restClient}
                />);
                break;
        }
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
                             switch (route.index) {
                                 case 'list':
                                     return (<Text style={styles.icon} onPress={() => navigator.push({index: 'settings_preview'})}><SettingsSVG/></Text>);
                                     break;

                                 case 'settings':
                                 case 'settings_preview':
                                 case 'register':
                                     return (<Text style={styles.direction} onPress={() => navigator.pop()}>Cancel</Text>);
                                     break;
                             }
                         },
                         RightButton: (route, navigator, index, navState) => {
                             switch (route.index) {
                                 case 'settings_preview':
                                     return (<Text style={styles.direction} onPress={() => navigator.push({index: 'settings'})}>Edit</Text>);
                                     break;
                             }
                         },
                         Title: (route, navigator, index, navState) => {
                             switch (route.index) {
                                 case 'settings_preview':
                                     return (<View><Text style={styles.navbarTitle}>Settings</Text></View>);
                                 break;

                                 case 'settings':
                                     return (<View><Text style={styles.navbarTitle}>Edit settings</Text></View>);
                                 break;

                                 case 'register':
                                     return (<View><Text style={styles.navbarTitle}>Register a new account</Text></View>);
                                 break;

                                 case 'preloader':
                                     return (<View/>);
                                 break;

                                 default:
                                     return (
                                         <View>
                                             <Text style={styles.navbarListTitle}>Tasteful <Text style={styles.navbarTitlePrimary}>Planet</Text></Text>
                                             <Text style={styles.userTitle}>{this.restClient.defaultUserTitle}</Text>
                                         </View>
                                     );
                                 break;
                             }
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
