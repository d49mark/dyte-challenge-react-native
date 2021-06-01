/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import {Header} from './src/Components/Header';
import DocumentScannerView from './src/Container/DocumentScanner';
import {FloatingAction} from 'react-native-floating-action';
import {ImageGrid} from './src/Components/ImageGrid';
import {color} from './src/Assets/ThemeConfig/colors';

var RNFS = require('react-native-fs');

const actions = [
  {
    text: 'Add Doc',
    icon: require('./src/Assets/Images/google-docs.png'),
    name: 'bt_add',
    position: 2,
  },
];
export const RefreshDocContext = React.createContext({
  refreshDocuments: () => {},
});
const App = () => {
  const [documentScanner, setDocumentScanner] = React.useState(false);
  const [imageArray, setImageArray] = React.useState([]);
  React.useEffect(() => {
    refreshDocuments();
  }, []);
  const refreshDocuments = () => {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(files => {
      setImageArray(files);
    });
  };
  if (documentScanner) {
    return (
      <RefreshDocContext.Provider value={refreshDocuments}>
        <DocumentScannerView
          setDocumentView={() => setDocumentScanner(false)}
        />
      </RefreshDocContext.Provider>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <StatusBar barStyle={'light-content'} />
        <Header />
        {imageArray?.length !== 0 && <ImageGrid images={imageArray} />}
        {(!imageArray || imageArray.length == 0) && (
          <View style={styles.noDocFound}>
            <Image
              style={{width: 200, height: 90, margin: 30}}
              resizeMethod={'auto'}
              resizeMode={'contain'}
              source={require('./src/Assets/Images/files.png')}
            />
            <Text style={styles.noDocText}>No Document Found</Text>
            <Text style={styles.actionText}>{`\nAdd Using Menu`}</Text>
          </View>
        )}
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            setDocumentScanner(true);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.PRIMARY},
  innerContainer: {flex: 1, backgroundColor: color.WHITE},
  noDocFound: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  noDocText: {
    fontWeight: '600',
    fontSize: 20,
    color: 'black',
  },
  actionText: {
    fontWeight: '600',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
});

export default App;
