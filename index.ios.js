/**
 * React Native Demo with eZ Platform
 * https://ezplatform.com
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableHighlight,
    ListView,
    ActivityIndicator,
    ScrollView,
    View,
    RefreshControl,
    TouchableWithoutFeedback
} from 'react-native';

const width = Dimensions.get('window').width;
const domain = "http://react.ezstudiodemo.com";

export default class PlacesAndTastes extends Component {
    constructor(props) {
        super(props);
        this.generateSession();
        this.state = {
            isLoading: true,
            isRefreshing: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }

    componentWillMount() {
        this.buildImageList();
    }

    async generateSession(){
        var userSession = "";
        var endpoint = "/api/ezp/v2/user/sessions";
        await fetch( domain + endpoint , {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.ez.api.Session+json',
                    'Content-Type': 'application/vnd.ez.api.SessionInput+json',
                },
                body: '{"SessionInput": {"login": "admin", "password": "publish"}}'
            }
        )
        .then((response) => response.json())
        .then(async (responseData) => await AsyncStorage.multiSet([["identifier", responseData["Session"]["identifier"]], ["csrfToken", responseData["Session"]["csrfToken"]], ["User", responseData["Session"]["User"]["_href"]]]))
        .catch((error) => console.log(error));
    };

    async buildImageList(){
        var csrfToken = await AsyncStorage.getItem("csrfToken");
        var endpoint = "/api/ezp/v2/views";
        var body = `<?xml version="1.0" encoding="UTF-8"?>
        <ViewInput>
            <identifier>AppImages</identifier>
            <Query>
                <Criteria>
                    <ContentTypeIdentifierCriterion>image</ContentTypeIdentifierCriterion>
                    <ParentLocationIdCriterion>206</ParentLocationIdCriterion>
                    <VisibilityCriterion>visible</VisibilityCriterion>
                </Criteria>
                <SortClauses>
                    <DatePublished>descending</DatePublished>
                </SortClauses>
            </Query>
        </ViewInput>`;

        return fetch( domain + endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.ez.api.View+json',
                    'Content-Type': 'application/vnd.ez.api.ViewInput+xml',
                    'X-CSRF-Token': csrfToken
                },
                body: body
            }
        )
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData["View"]["Result"]["searchHits"]["searchHit"]),
                isLoading: false
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return this.renderLoadingView();
        }

        return (
            <View style={styles.container}>
                <View style={styles.statusBar}>
                </View>

                <View style={styles.navbar}>
                    <Text style={styles.navbarTitle}>Tasteful <Text style={styles.navbarTitlePrimary}>Planet</Text></Text>
                </View>

                <ScrollView
                    style={styles.scrollview}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                            tintColor="#000"
                            title="Reloading image list..."
                            titleColor="#000"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderImage.bind(this)}
                        style={styles.listView}
                    />
                </ScrollView>
            </View>
        );
    }

    onRefresh = () => {
        this.setState({isRefreshing: true});

        setTimeout(() => {
          this.buildImageList();

          this.setState({
            isRefreshing: false
          });
        }, 1000);
    };

    renderImage(image) {
        var imageUri = image["value"]["Content"]["CurrentVersion"]["Version"]["Fields"]["field"][2]["fieldValue"]["uri"];
        return (
            <TouchableWithoutFeedback underlayColor='#dddddd'>
                <View style={styles.imageList} >
                    <Image
                        source={{uri: domain+imageUri}}
                        style={styles.imageItem} />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <View style={styles.statusBar}></View>
                <View style={styles.navbar}>
                    <Text style={styles.navbarTitle}>Tasteful <Text style={styles.navbarTitlePrimary}>Planet</Text></Text>
                </View>
                <ActivityIndicator size='small' style={styles.loadingIndicator}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        fontWeight: "500"
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
    imageList: {
        alignItems: 'center'
    },
    imageItem: {
        width: width-6,
        height: width-6,
        marginBottom: 3
    }
});

AppRegistry.registerComponent('PlacesAndTastes', () => PlacesAndTastes);
