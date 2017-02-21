class Configuration {
    static data = {
        domain: 'http://react.ezstudiodemo.com',
        username: 'admin',
        password: 'publish'
    };

    static getDomain() {
        return this.data.domain;
    }

    static getUsername() {
        return this.data.username;
    }

    static getPassword() {
        return this.data.password;
    }
}
export default Configuration;
