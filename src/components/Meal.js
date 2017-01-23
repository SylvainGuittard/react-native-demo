import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
    Dimensions
} from 'react-native';

const appWidth = Dimensions.get('window').width,
      styles = StyleSheet.create({
          imageList: {
              alignItems: 'center'
          },
          imageItem: {
            width: appWidth-6,
            height: appWidth-6
          },
          imageDetails: {
              backgroundColor: '#fff',
              width: appWidth,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 30,
              paddingRight: 30
          },
          imageName: {
              color: '#5193df',
              fontWeight: '600',
              fontSize: 17,
              textAlign: 'left',
          },
          imageCaption: {
              paddingTop: 10,
              color: '#000',
              fontWeight: '500',
          }
      });

class Meal extends Component{
    constructor(props) {
        super(props);

        this.imageUri = props.imageUri;
        this.imageName = props.imageName;
        this.imageCaption = props.imageCaption;

        this.state = {
            expanded: false,
            animation: new Animated.Value()
        };
    }

    toggle() {
        let initialValue = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded: !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    setMaxHeight(event) {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    setMinHeight(event) {
        this.setState({
            minHeight: event.nativeEvent.layout.height+2
        });
        this.state.animation.setValue(event.nativeEvent.layout.height+2);
    }

    render() {
        return (
            <TouchableHighlight onPress={this.toggle.bind(this)} underlayColor='#ddd'>
                <Animated.View style={[styles.imageList, {height: this.state.animation}]}>
                    <Image
                        source={{uri: this.imageUri}}
                        style={styles.imageItem}
                        onLayout={this.setMinHeight.bind(this)}
                    />
                    <View style={styles.imageDetails} onLayout={this.setMaxHeight.bind(this)}>
                        <Text style={styles.imageName}>{this.imageName}</Text>
                        {this.imageCaption !== '' &&
                            <Text style={styles.imageCaption}>{this.imageCaption}</Text>
                        }
                    </View>
                </Animated.View>
            </TouchableHighlight>
        );
    }
}
export default Meal;
