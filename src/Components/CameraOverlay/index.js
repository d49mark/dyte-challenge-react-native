/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ScannerFilters from '../../Container/DocumentScanner/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import {color} from '../../Assets/ThemeConfig/colors';
import {getScaledSize, size} from '../../Assets/ThemeConfig/mixins';
import {isIos} from '../../Assets/Utils';
const renderCameraControls = ({
  takingPicture,
  processingImage,
  renderFilters,
  onPressFilters,
  onSaturationChange,
  onContrastChange,
  onBrightnessChange,
  quality,
  saturation,
  brightness,
  onPressCancel,
  onPressCapture,
  contrast,
  enableTorch,
  onPressToggleTorch,
}) => {
  const cameraIsDisabled = takingPicture || processingImage;
  const disabledStyle = {opacity: cameraIsDisabled ? 0.8 : 1};
  return (
    <View style={styles.cameraControlContainer}>
      {renderFilters && (
        <ScannerFilters
          onBrightnessChange={onBrightnessChange}
          onSaturationChange={onSaturationChange}
          onContrastChange={onContrastChange}
          quality={quality}
          saturation={saturation}
          brightness={brightness}
          contrast={contrast}
        />
      )}
      <View style={styles.buttonBottomContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={onPressCancel}
            activeOpacity={0.8}>
            <Icon name="ios-close-circle" size={40} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.cameraOutline, disabledStyle]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cameraButton}
            onPress={onPressCapture}
          />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={isIos ? onPressFilters : onPressToggleTorch}>
            <Icon
              name={isIos ? 'color-filter' : 'flashlight'}
              size={getScaledSize(2, 'H7')}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{isIos ? 'Filters' : 'Torch'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export const CameraOverlay = props => {
  const {
    processingImage,
    loadingCamera,
    takingPicture,
    renderFilters,
    onPressFilters,
    onSaturationChange,
    onContrastChange,
    onBrightnessChange,
    quality,
    saturation,
    brightness,
    onPressCancel,
    onPressCapture,
    contrast,
    enableTorch,
    onPressToggleTorch,
  } = props;

  let loadingState = null;
  if (loadingCamera) {
    loadingState = (
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="white" />
          <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
        </View>
      </View>
    );
  } else if (processingImage) {
    loadingState = (
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          {isIos && <ActivityIndicator color="#333333" size="small" />}
          <Text style={styles.processingCameraMessage}>Processing</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {loadingState}
      <SafeAreaView style={[styles.overlay]}>
        {renderCameraControls({
          takingPicture,
          processingImage,
          renderFilters,
          onPressFilters,
          onSaturationChange,
          onContrastChange,
          onBrightnessChange,
          quality,
          saturation,
          brightness,
          onPressCancel,
          onPressCapture,
          contrast,
          enableTorch,
          onPressToggleTorch,
        })}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  cameraControlContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonBottomContainer: {
    margin: size.H7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  buttonGroup: {
    backgroundColor: color.BLACK,
    borderRadius: 17,
  },
  buttonIcon: {
    color: color.WHITE,
    fontSize: 22,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttonText: {
    color: color.WHITE,
    fontSize: 13,
  },
  cameraButton: {
    backgroundColor: color.PRIMARY,
    borderRadius: getScaledSize(5, 'H1'),
    flex: 1,
    margin: 3,
  },
  cameraOutline: {
    borderColor: color.WHITE,
    borderRadius: getScaledSize(5, 'H1'),
    borderWidth: 3,
    height: getScaledSize(10, 'H0'),
    width: getScaledSize(10, 'H0'),
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  processingCameraMessage: {color: color.LOADING, fontSize: 30, marginTop: 10},
});
