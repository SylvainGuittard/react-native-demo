# React Native Demo

Instagram-like demo app using eZ Platform Demo

## Developer steps

### Install node.js

```bash
brew install node
brew install watchman
```

### Install React Native CLI

```bash
npm install -g react-native-cli
```

### Install xcode

xcode can be installed using Apple AppStore.

### Install react-native-demo app

- clone Git repo into an existing folder:

```bash
git clone https://github.com/SylvainGuittard/react-native-demo.git .
```

- install additional `node.js` dependencies:

```bash
npm install
```

- rebuild ios/android folders:

```bash
react-native upgrade
```

- configure pre-domain exception so that application can connect to a non-secure host. Add this to `ios/PlacesAndTastes/Info.plist` file:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSExceptionDomains</key>
  <dict>
    <key>yourserver.com</key>
    <dict>
      <!--Include to allow subdomains-->
      <key>NSIncludesSubdomains</key>
      <true/>
      <!--Include to allow HTTP requests-->
      <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
      <true/>
      <!--Include to specify minimum TLS version-->
      <key>NSTemporaryExceptionMinimumTLSVersion</key>
      <string>TLSv1.1</string>
    </dict>
  </dict>
</dict>
```

Please, don't forget to replace `yourserver.com` to your domain name (eg. `react.ezstudiodemo.com`).

### Testing application

```bash
react-native run-ios
```
