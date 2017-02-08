/**
 * React Native Demo with eZ Platform
 * https://ezplatform.com
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    ListView,
    ActivityIndicator,
    ScrollView,
    View,
    RefreshControl
} from 'react-native';
import Meal from './src/components/Meal';
import RestClient from './src/RestClient';

const domain = 'http://react.ezstudiodemo.com',
      username = 'admin',
      password = 'publish',
      loadingCaption = 'Reloading image list...',
      styles = StyleSheet.create({
          container: {
              backgroundColor: '#f2f2f2',
              flex: 1,
          },
          navbar: {
              alignItems: 'center',
              backgroundColor: '#fff',
              borderBottomColor: '#eee',
              borderColor: 'transparent',
              borderWidth: 1,
              justifyContent: 'center',
              height: 44,
              marginBottom: 3,
              flexDirection: 'row'
          },
          navbarTitle: {
              color: '#444',
              fontSize: 16,
              fontWeight: '500'
          },
          navbarTitlePrimary: {
              color: '#337ab7'
          },
          statusBar: {
              backgroundColor: '#fff',
              height: 22
          },
          loadingIndicator: {
              marginTop: 20
          },
      });

export default class PlacesAndTastes extends Component {
    constructor(props) {
        super(props);

        this.restClient = new RestClient({
            domain: domain,
            username: username,
            password: password
        });

        this.restClient.generateSession(username, password);

        this.state = {
            isLoading: true,
            isRefreshing: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }

    /**
     * Build image list before rendering list view.
     */
    componentWillMount() {
        this.restClient.buildImageList(
            (responseData) => this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
                isLoading: false
            })
        );
    }

    /**
     * Render main app view.
     */
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <View style={styles.statusBar}/>
                    <View style={styles.navbar}>
                        <Text style={styles.navbarTitle}>Tasteful <Text style={styles.navbarTitlePrimary}>Planet</Text></Text>
                    </View>
                    <ActivityIndicator size='small' style={styles.loadingIndicator}/>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.statusBar}/>
                <View style={styles.navbar}>
                    <Text style={styles.navbarTitle}>Tasteful <Text style={styles.navbarTitlePrimary}>Planet</Text></Text>
                </View>

                <ScrollView
                    style={styles.scrollview}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                            tintColor='#000'
                            title={loadingCaption}
                            titleColor='#000'
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor='#ffff00'
                        />
                    }>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        style={styles.listView}
                    />
                </ScrollView>
            </View>
        );
    }

    onRefresh = () => {
        this.setState({
            isRefreshing: true
        });

        setTimeout(() => {
          this.componentWillMount();

          this.setState({
            isRefreshing: false
          });
        }, 1000);
    };

    renderRow(rowData) {
        let imageName = rowData.name,
            imageUri = domain + rowData.uri,
            imageCaption = rowData.caption
                .replace(/(<([^>]+)>)/ig, '')
                .trim();

        return (<Meal imageName={imageName} imageUri={imageUri} imageCaption={imageCaption}/>);
    }
}

AppRegistry.registerComponent('PlacesAndTastes', () => PlacesAndTastes);
