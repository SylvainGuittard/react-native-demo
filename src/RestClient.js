import {
    AsyncStorage
} from 'react-native';

export default class RestClient {
    constructor(props) {
        this.defaultUserTitle = 'Administrator User';
        this.defaultUserGroupLocationId = 13;
        this.domain = props.domain;
    }

    async generateSession(username, password, callback) {
        await fetch(this.domain + '/api/ezp/v2/user/sessions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.ez.api.Session+json',
                    'Content-Type': 'application/vnd.ez.api.SessionInput+json',
                },
                body: '{"SessionInput": {"login": "'+username+'", "password": "'+password+'"}}'
            })
            .then(function (response) {
                if (response.ok) {

                    // store working credentials for further use
                    AsyncStorage.multiSet([
                        ['_username', username],
                        ['_password', password]
                    ]);
                }

                return response.json();
            })
            .then(callback)
            .catch(error => {
                return Promise.reject();
            });
    };

    async destroySession(callback) {
        let csrfToken = await AsyncStorage.getItem('csrfToken'),
            sessionId = await AsyncStorage.getItem('identifier');

        await fetch(this.domain + '/api/ezp/v2/user/sessions/'+sessionId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.ez.api.Session+json',
                'Content-Type': 'application/vnd.ez.api.SessionInput+json',
                'X-CSRF-Token': csrfToken
            }
        })
        .then(function (response) {
            return response;
        })
        .then(callback)
        .catch(error => {
            return Promise.reject()
        });
    };

    async getUserByHref(href, callback) {
        let csrfToken = await AsyncStorage.getItem('csrfToken');

        return fetch(this.domain + href, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.ez.api.User+json',
                'Content-Type': 'application/vnd.ez.api.User+xml',
                'X-CSRF-Token': csrfToken
            }
            })
            .then(function (response) {
                return response.json();
            })
            .then(callback)
            .catch(error => {
                return Promise.reject()
            });
    }

    async createUser(firstName, lastName, email, username, password, callback) {
        let csrfToken = await AsyncStorage.getItem('csrfToken')

        return fetch(this.domain + '/api/ezp/v2/user/groups/'+this.defaultUserGroupLocationId+'/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ez.api.User+json',
                'Content-Type': 'application/vnd.ez.api.UserCreate+xml',
                'X-CSRF-Token': csrfToken
            },
            body: `<?xml version="1.0" encoding="UTF-8"?>
                    <UserCreate>
                      <mainLanguageCode>eng-GB</mainLanguageCode>
                      <login>`+username+`</login>
                      <email>`+email+`</email>
                      <password>`+password+`</password>
                      <fields>
                        <field>
                          <fieldDefinitionIdentifier>first_name</fieldDefinitionIdentifier>
                          <fieldValue>`+firstName+`</fieldValue>
                        </field>
                        <field>
                          <fieldDefinitionIdentifier>last_name</fieldDefinitionIdentifier>
                          <fieldValue>`+lastName+`</fieldValue>
                        </field>
                      </fields>
                    </UserCreate>`
            })
            .then(function (response) {
                return response.json();
            })
            .then(callback)
            .catch(error => {
                return Promise.reject()
            });
    }

    async buildImageList(callback) {
        let csrfToken = await AsyncStorage.getItem('csrfToken');

        return fetch(this.domain + '/api/ezp/v2/views', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.ez.api.View+json',
                    'Content-Type': 'application/vnd.ez.api.ViewInput+xml',
                    'X-CSRF-Token': csrfToken
                },
                body: `<?xml version="1.0" encoding="UTF-8"?>
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
                        </ViewInput>`
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
