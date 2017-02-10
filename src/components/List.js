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
import Meal from './Meal';

const loadingCaption = 'Reloading image list...',
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
        statusBar: {
            backgroundColor: '#fff',
            height: 22
        },
        loadingIndicator: {
            marginTop: 20
        },
    });

class List extends Component {
    constructor(props) {
        super(props);

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
        this.props.restClient.buildImageList(
            (responseData) => this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
                isLoading: false
            })
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='small' style={styles.loadingIndicator}/>
                </View>
            );
        }

        return (
            <View style={styles.container}>
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
            imageUri = this.props.domain + rowData.uri,
            imageCaption = rowData.caption
                .replace(/(<([^>]+)>)/ig, '')
                .trim();

        return (<Meal imageName={imageName} imageUri={imageUri} imageCaption={imageCaption}/>);
    }
}

export default List;
