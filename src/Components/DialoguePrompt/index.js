/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {color} from '../../Assets/ThemeConfig/colors';
import {getScaledSize, size} from '../../Assets/ThemeConfig/mixins';

export const DialoguePrompt = props => {
  const {
    onPressCancel,
    onPressActionButton,
    heading,
    description,
    actionText,
    isVisible,
  } = props;
  if (isVisible) {
    return (
      <View style={styles.backDrop}>
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Icon name={'error-outline'} size={40} color="red"></Icon>
            <Text style={{fontSize: 18, fontWeight: '600', color: 'black'}}>
              {heading}
            </Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onPressCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={onPressActionButton}>
              <Text style={styles.buttonText}>{actionText || 'Okay'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return <></>;
};

const styles = StyleSheet.create({
  backDrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  innerContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.WHITE,
  },
  textContainer: {
    margin: getScaledSize(2, 'H2'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    width: getScaledSize(10, 'H7'),
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '300',
    color: color.BLACK,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: 'white',
  },
  buttonText: {color: 'white', fontWeight: '600'},
  button: {
    borderRadius: size.H0,
    width: getScaledSize(5, 'H7'),
    margin: size.H0,
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: color.PRIMARY,
    paddingVertical: size.H1,
    justifyContent: 'center',
  },
  cancelButton: {
    borderRadius: size.H0,
    width: getScaledSize(5, 'H7'),
    margin: size.H0,
    alignItems: 'center',
    backgroundColor: color.NOACTION,
    paddingVertical: 10,
    justifyContent: 'center',
  },
});
