import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {color} from '../../Assets/ThemeConfig/colors';
import {size} from '../../Assets/ThemeConfig/mixins';

export const Header = props => {
  const {text} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Document Scanner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.PRIMARY,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: size.H6,
    letterSpacing: 0.7,
    fontWeight: '600',
    color: color.WHITE,
    marginHorizontal: size.H7,
  },
});
