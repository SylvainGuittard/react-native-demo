import {
    AsyncStorage
} from 'react-native';

export default class RestClient {
    constructor(props) {
        this.username = props.username;
        this.password = props.password;
        this.domain = props.domain;
    }

    async generateSession(username, password) {
        let endpoint = '/api/ezp/v2/user/sessions';

        await fetch(this.domain + endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.ez.api.Session+json',
                    'Content-Type': 'application/vnd.ez.api.SessionInput+json',
                },
                body: '{"SessionInput": {"login": "'+username+'", "password": "'+password+'"}}'
            })
            .then((response) => response.json())
            .then(async (responseData) => await AsyncStorage.multiSet([
                ['identifier', responseData['Session']['identifier']],
                ['csrfToken', responseData['Session']['csrfToken']],
                ['User', responseData['Session']['User']['_href']]]))
            .catch((error) => console.log(error));
    };

    async buildImageList(callback) {
        let csrfToken = await AsyncStorage.getItem('csrfToken'),
            endpoint = '/api/ezp/v2/views',
            body = `<?xml version="1.0" encoding="UTF-8"?>
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

        return fetch(this.domain + endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.ez.api.View+json',
                    'Content-Type': 'application/vnd.ez.api.ViewInput+xml',
                    'X-CSRF-Token': csrfToken
                },
                body: body
            })
            .then(function (response) {
                if (response.status !== 200) {
                    return Promise.reject('Not found 404');
                }

                return response.json().then(function (json) {
                    return this._repackImageData(json);
                }.bind(this));
            }.bind(this))
            .then(callback);
    }

    _repackImageData(responseData) {
        let contentData = {},
            index = 0;

        responseData['View']['Result']['searchHits']['searchHit'].forEach(function (image) {
            let contentId = (index++)+'_'+image['value']['Content']['_id'];

            contentData[contentId] = {
                name: image['value']['Content']['Name'],
                caption: image['value']['Content']['CurrentVersion']['Version']['Fields']['field'][1]['fieldValue']['xml'],
                uri: image['value']['Content']['CurrentVersion']['Version']['Fields']['field'][2]['fieldValue']['uri']
            };
        });

        return contentData;
    }
}
