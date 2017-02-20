import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    ActivityIndicator
} from 'react-native';

const appWidth = Dimensions.get('window').width,
    appHeight = Dimensions.get('window').height,
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            height: appHeight,
            width: appWidth
        },
        indicator: {
            marginTop: appHeight/2-90
        },
        description: {
            textAlign: 'center',
            marginTop: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#308ffc'
        }
    });

class Preloader extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#308ffc" style={styles.indicator}/>
                <Text style={styles.description}>please wait...</Text>
            </View>
        );
    }
}
export default Preloader;
