/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {RefreshDocContext} from '../../../App';

export const EnterFileName = props => {
  const refreshDoc = useContext(RefreshDocContext);
  const {images, onPressSave, onPressCancel} = props;
  const [text, setText] = React.useState('');
  return (
    <View style={styles.backDropContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={text => setText(text)}
          value={text}
          placeholderTextColor={'#C7C7CD'}
          placeholder="Enter File Name"
          keyboardType="default"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onPressCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onPressSave(text);
              refreshDoc();
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backDropContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25,
  },
  buttonContainer: {flexDirection: 'row', alignItems: 'center'},
  buttonText: {color: 'white'},
  input: {
    color: 'black',
    height: 45,
    width: 200,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1253b0',
    padding: 10,
    height: 40,
    width: 80,
    justifyContent: 'center',
  },
  cancelButton: {
    margin: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    height: 40,
    width: 80,
    justifyContent: 'center',
  },
});
