import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';
import Camera from 'react-native-camera';

const appWidth = Dimensions.get('window').width,
      appHeight = Dimensions.get('window').height,
      styles = StyleSheet.create({
          preview: {
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: appHeight,
              width: appWidth
          },
          capture: {
              flex: 0,
              backgroundColor: '#fff',
              borderRadius: 5,
              color: '#000',
              padding: 10,
              margin: 40
          }
      });

class Photographer extends Component{
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    takePicture() {
        this.camera.capture()
            .then((data) => console.log(data))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <Camera
                ref={(cam) => {this.camera = cam}}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}
            >
                <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
            </Camera>
        );
    }
}
export default Photographer;
