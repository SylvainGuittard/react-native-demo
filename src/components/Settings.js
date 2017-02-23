import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    Alert,
    AsyncStorage
} from 'react-native';
import Hr from 'react-native-hr';

const appWidth = Dimensions.get('window').width,
      appHeight = Dimensions.get('window').height,
      underlayColor = '#308ffc',
      styles = StyleSheet.create({
          container: {
              backgroundColor: '#fff',
              height: appHeight,
              width: appWidth
          },
          field: {
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 10
          },
          field_website: {
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 20
          },
          header: {
              color: '#87878b',
              marginTop: 30,
              marginLeft: 20,
              fontSize: 11,
              fontWeight: 'bold'
          },
          header_website: {
              color: '#87878b',
              marginTop: 10,
              marginLeft: 20,
              fontSize: 11,
              fontWeight: 'bold'
          },
          input: {
              color: '#000',
              fontSize: 15,
              width: appWidth-40,
              backgroundColor: '#eaebed',
              borderRadius: 5,
              height: 35,
              paddingLeft: 10,
              paddingRight: 10,
              fontWeight: 'bold',
              marginLeft: 20

          },
          loginButton: {
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              borderColor: '#308ffc',
              borderWidth: 2,
              padding: 10,
              borderRadius: 20
          },
          registerButton: {
              marginTop: 10,
              marginLeft: 80,
              marginRight: 80,
              borderColor: '#308ffc',
              borderWidth: 2,
              padding: 10,
              borderRadius: 20
          },
          buttonText: {
              textAlign: 'center',
              color: '#308ffc',
              fontSize: 15,
              fontWeight: 'bold'
          },
          buttonTextHover: {
              textAlign: 'center',
              color: '#fff',
              fontSize: 15,
              fontWeight: 'bold'
          },
          registerDescription: {
              textAlign: 'center',
              marginTop: 50,
              fontSize: 14
          }
      });

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registerButtonStyle: styles.buttonText,
            loginButtonStyle: styles.buttonText,
            username: '',
            usernamePlaceholder: '',
            password: '',
            domain: '',
            domainPlaceholder: ''
        };
    }

    componentWillMount() {
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        this.setState({
            usernamePlaceholder: await AsyncStorage.getItem('_username'),
            domain: await AsyncStorage.getItem('_domain'),
            domainPlaceholder: await AsyncStorage.getItem('_domain')
        });
    }

    onLoginButtonPressIn() {
        this.setState({
            loginButtonStyle: styles.buttonTextHover
        });
    }

    onLoginButtonPressOut() {
        this.setState({
            loginButtonStyle: styles.buttonText
        });
    }

    onLoginPress() {
        let username = this.state.username,
            password = this.state.password,
            domain = this.state.domain;

        if (domain === '' || username === '' || password === '') {
            Alert.alert('Error', 'Please fill out all required fields');

            return;
        }

        this.props.navigator.push({index: 'preloader'});
        this.props.restClient.destroySession(this._logoutCallback.bind(this));
    }

    _logoutCallback(results) {
        this.props.restClient.generateSession(
            this.state.domain,
            this.state.username,
            this.state.password,
            this._loginCallback.bind(this)
        );

        // @todo: we could do something in case of logout issues
    }

    async _loginCallback(results, isError) {
        let oldUsername = await AsyncStorage.getItem('_username'),
            oldPassword = await AsyncStorage.getItem('_password'),
            oldDomain = await AsyncStorage.getItem('_domain'),
            errorMessage = 'Login or password is incorrect';

        if (isError) {
            errorMessage = results.message;
        }

        if (isError || !results['Session']) {
            Alert.alert(
                'Error',
                errorMessage,
                [
                    {text: 'Try again', onPress: () => {
                        this.props.restClient.generateSession(oldDomain, oldUsername, oldPassword, function (results) {
                            AsyncStorage.multiSet([
                                ['identifier', results['Session']['identifier']],
                                ['csrfToken', results['Session']['csrfToken']],
                                ['User', results['Session']['User']['_href']]
                            ]);

                            this.props.restClient.getUserByHref(results['Session']['User']['_href'], function (results2) {
                                this.props.restClient.defaultUserTitle = results2['User']['name'];

                                // go back to list
                                this.props.navigator.pop();
                            }.bind(this));
                        }.bind(this))
                    }}
                ]
            );

            return;
        }

        AsyncStorage.multiSet([
            ['identifier', results['Session']['identifier']],
            ['csrfToken', results['Session']['csrfToken']],
            ['User', results['Session']['User']['_href']]
        ]);

        this.props.restClient.getUserByHref(
            results['Session']['User']['_href'],
            this._userCallback.bind(this)
        );
    }

    _userCallback(results) {
        this.props.restClient.defaultUserTitle = results['User']['name'];
        this.props.navigator.popToTop();
    }

    onRegisterButtonPressIn() {
        this.setState({
            registerButtonStyle: styles.buttonTextHover
        });
    }

    onRegisterButtonPressOut() {
        this.setState({
            registerButtonStyle: styles.buttonText
        });
    }

    onRegisterPress() {
        this.props.navigator.push({index: 'register'});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header_website}>{'Server'.toUpperCase()}</Text>
                <View style={styles.field_website}>
                    <TextInput
                        onChangeText={domain => this.setState({domain})}
                        value={this.state.domain}
                        autoCorrect={false}
                        keyboardType="url"
                        autoCapitalize="none"
                        placeholder={this.state.domainPlaceholder}
                        style={styles.input}
                    />
                </View>
                <Hr lineColor='#87878b'/>
                <Text style={styles.header}>{'User account'.toUpperCase()}</Text>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={username => this.setState({username})}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder={this.state.usernamePlaceholder}
                        style={styles.input}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={password => this.setState({password})}
                        autoCorrect={false}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="(type your password here)"
                        style={styles.input}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.onLoginPress.bind(this)}
                    onPressIn={this.onLoginButtonPressIn.bind(this)}
                    onPressOut={this.onLoginButtonPressOut.bind(this)}
                    underlayColor={underlayColor}
                    style={styles.loginButton}
                >
                    <Text style={this.state.loginButtonStyle}>Apply</Text>
                </TouchableHighlight>
                <Text style={styles.registerDescription}>Don{"'"}t have an account yet?</Text>
                <TouchableHighlight
                    onPress={this.onRegisterPress.bind(this)}
                    onPressIn={this.onRegisterButtonPressIn.bind(this)}
                    onPressOut={this.onRegisterButtonPressOut.bind(this)}
                    onChangeText={password => this.setState({password})}
                    underlayColor={underlayColor}
                    style={styles.registerButton}
                >
                    <Text style={this.state.registerButtonStyle}>Register</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
export default Settings;
