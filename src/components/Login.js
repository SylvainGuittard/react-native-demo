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

const appWidth = Dimensions.get('window').width,
      appHeight = Dimensions.get('window').height,
      underlayColor = '#308ffc',
      styles = StyleSheet.create({
          container: {
              backgroundColor: '#fff',
              height: appHeight,
              width: appWidth
          },
          header: {
              marginTop: 30,
              marginBottom: 30,
              marginLeft: 10,
              marginRight: 10,
              textAlign: 'center',
              fontSize: 17
          },
          field: {
              flexDirection: 'row',
              marginTop: 20
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
              marginTop: 50,
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
              marginTop: 60,
              fontSize: 14
          }
      });

class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            registerButtonStyle: styles.buttonText,
            loginButtonStyle: styles.buttonText,
            login: '',
            password: ''
        };
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
        let login = this.state.login,
            password = this.state.password;

        if (login === '' || password === '') {
            Alert.alert('Valid login and password are required');

            return;
        }

        this.props.navigator.push({index: 'preloader'});

        setTimeout(() => {
            this.props.navigator.pop();
        }, 2000);

        this.props.restClient.destroySession(this._logoutCallback.bind(this));
    }

    _logoutCallback(results) {
        this.props.restClient.generateSession(
            this.state.login,
            this.state.password,
            this._loginCallback.bind(this)
        );

        // @todo: we could do something in case of logout issues
    }

    async _loginCallback(results) {
        let oldUsername = await AsyncStorage.getItem('_username'),
            oldPassword = await AsyncStorage.getItem('_password');

        if (!results['Session']) {
            Alert.alert(
                'Error',
                'Login or password is incorrect',
                [
                    {text: 'Try again', onPress: () => {
                        this.props.restClient.generateSession(oldUsername, oldPassword, function (results) {
                            AsyncStorage.multiSet([
                                ['identifier', results['Session']['identifier']],
                                ['csrfToken', results['Session']['csrfToken']],
                                ['User', results['Session']['User']['_href']]
                            ]);

                            this.props.restClient.getUserByHref(results['Session']['User']['_href'], function (results2) {
                                this.props.restClient.defaultUserTitle = results2['User']['name'];
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
        this.props.navigator.pop();
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
                <Text style={styles.header}>To share your pictures with other users, you need to be logged in</Text>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={login => this.setState({login})}
                        autofocus={true}
                        autoCapitalize="none"
                        placeholder="Login"
                        style={styles.input}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={password => this.setState({password})}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="Password"
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
                    <Text style={this.state.loginButtonStyle}>Login</Text>
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
export default Login;
