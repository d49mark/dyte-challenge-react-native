import Slider from '@react-native-community/slider';
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';
import {Dimensions, Text, View, StyleSheet} from 'react-native';

// Renders configuration of filter using sliders for the platform
export default class ScannerFilters extends Component {
  static propTypes = {
    onBrightnessChange: PropTypes.func.isRequired,
    onSaturationChange: PropTypes.func.isRequired,
    onContrastChange: PropTypes.func.isRequired,
  };

  render() {
    const {onBrightnessChange, onSaturationChange, onContrastChange} =
      this.props;
    const dimensions = Dimensions.get('window');
    const aspectRatio = dimensions.height / dimensions.width;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Brightness</Text>
        <Slider
          onValueChange={onBrightnessChange}
          style={{height: 40}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#1243b"
          maximumTrackTintColor="#1243b"
        />
        <Text style={styles.label}>Saturation</Text>
        <Slider
          onValueChange={onSaturationChange}
          style={{height: 40}}
          minimumValue={0}
          maximumValue={5}
          minimumTrackTintColor="#1243b"
          maximumTrackTintColor="#1243b"
        />
        <Text style={styles.label}>Contrast</Text>
        <Slider
          onValueChange={onContrastChange}
          style={{height: 40}}
          minimumValue={0}
          maximumValue={5}
          minimumTrackTintColor="#1243b"
          maximumTrackTintColor="#1243b"
        />
        <View style={styles.pointerShape} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    position: 'relative',
    right: 0,
    left: 0,
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  filterName: {flex: 1, color: 'white', fontSize: 13},
  pointerShape: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 30,
    borderLeftWidth: 30,
    borderTopColor: 'rgba(0,0,0,0.7)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    right: 8,
    bottom: -58,
  },
  label: {color: 'white'},
});
