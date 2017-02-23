import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    AsyncStorage
} from 'react-native';
import Hr from 'react-native-hr';

const appWidth = Dimensions.get('window').width,
    appHeight = Dimensions.get('window').height,
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            height: appHeight,
            width: appWidth
        },
        header: {
            color: '#87878b',
            marginTop: 10,
            marginBottom: 5,
            marginLeft: 20,
            fontSize: 11,
            fontWeight: 'bold'
        },
        field: {
            color: '#000',
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 20,
            fontSize: 13
        }
    });

class SettingsPreview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            domain: ''
        };
    }

    componentWillMount() {
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        this.setState({
            username: await AsyncStorage.getItem('_username'),
            domain: await AsyncStorage.getItem('_domain')
        });
    }

    render() {
        return (
            <View>
                <Text style={styles.header}>{'Server'.toUpperCase()}</Text>
                <Hr lineColor='#87878b'/>
                <Text style={styles.field}>{this.state.domain}</Text>
                <Text style={styles.header}>{'User account'.toUpperCase()}</Text>
                <Hr lineColor='#87878b'/>
                <Text style={styles.field}>{this.state.username}</Text>
            </View>
        );
    }
}
export default SettingsPreview;
