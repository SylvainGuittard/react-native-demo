import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Alert
} from 'react-native';

const appWidth = Dimensions.get('window').width,
      underlayColor = '#308ffc',
      styles = StyleSheet.create({
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
          registerButton: {
              marginTop: 30,
              marginLeft: 30,
              marginRight: 30,
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
          }
      });

class Register extends Component{
    constructor(props) {
        super(props);

        this.state = {
            registerButtonStyle: styles.buttonText,
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            email: ''
        };
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
        let firstName = this.state.firstName,
            lastName = this.state.lastName,
            email = this.state.email,
            username = this.state.username,
            password = this.state.password;

        if (firstName === ''
            || lastName === ''
            || email === ''
            || username === ''
            || password === '') {
            Alert.alert('All fields are required');

            return;
        }

        this.props.navigator.push({index: 'preloader'});

        this.props.restClient.createUser(
            firstName,
            lastName,
            email,
            username,
            password,
            this._resultsCallback.bind(this)
        );
    }

    _resultsCallback(results) {
        if (results.ErrorMessage) {
            Alert.alert(
                'User cannot be created',
                results.ErrorMessage.errorDescription,
                [
                    {text: 'Try again', onPress: () => this.props.navigator.pop()}
                ]
            );

            return results;
        }

        Alert.alert(
            'Success!',
            'New account has been created',
            [
                {text: 'Login', onPress: () => {
                    this.props.navigator.pop();
                    this.props.navigator.pop(); // @todo: this could fallback to login procedure and authorize user
                }}
            ]
        );

        return results;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={firstName => this.setState({firstName})}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="First Name"
                        style={styles.input}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={lastName => this.setState({lastName})}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Last Name"
                        style={styles.input}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={email => this.setState({email})}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="E-mail"
                        keyboardType="email-address"
                        style={styles.input}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={username => this.setState({username})}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Username"
                        style={styles.input}
                    />
                </View>
                <View style={styles.field}>
                    <TextInput
                        onChangeText={password => this.setState({password})}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.onRegisterPress.bind(this)}
                    onPressIn={this.onRegisterButtonPressIn.bind(this)}
                    onPressOut={this.onRegisterButtonPressOut.bind(this)}
                    underlayColor={underlayColor}
                    style={styles.registerButton}
                >
                    <Text style={this.state.registerButtonStyle}>Register</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
export default Register;
