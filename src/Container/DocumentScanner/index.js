import {PropTypes} from 'prop-types';
import React, {PureComponent} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner';
import ImagePicker from 'react-native-image-crop-picker';
import {EnterFileName} from '../../Components/EnterFileName';
import CameraRoll from '@react-native-community/cameraroll';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {DialoguePrompt} from '../../Components/DialoguePrompt';
import {CameraOverlay} from '../../Components/CameraOverlay';
import {isIos} from '../../Assets/Utils';

// require the module
var RNFS = require('react-native-fs');

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  cameraNotAvailableContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  flashControl: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    margin: 8,
    paddingTop: 7,
    width: 50,
  },
  loadingCameraMessage: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
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
  scanner: {
    flex: 1,
    width: 400,
    height: 100,
  },
});

export default class DocumentScannerView extends PureComponent {
  static propTypes = {
    setDocumentView: PropTypes.func,
  };

  static defaultProps = {
    setDocumentView: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      torchEnable: false,
      renderFilters: false,
      saturation: 1,
      contrast: 1.1,
      brightness: 0.3,
      askForName: false,
      imageWidth: 400,
      imageHeight: 400,
      showScannerView: true,
      detectedRectangle: false,
      loadingCamera: true,
      processingImage: false,
      takingPicture: false,
      hasPermission: false,
      overlayFlashOpacity: new Animated.Value(0),
      onPressActionButton: () => {},
      actionButtonText: '',
      dialogueDescriptionText: '',
      showDialogue: false,
      device: {
        previewHeightPercent: 1,
        previewWidthPercent: 1,
      },
    };
    this.customCrop = React.createRef();
    this.camera = React.createRef();
    this.imageProcessorTimeout = null;
  }
  checkForPermission = () => {
    const Permission = isIos
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
    check(Permission)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE: {
            this.setState({
              hasPermission: false,
              showScannerView: false,
              loadingCamera: false,
              dialogueDescriptionText:
                'This feature is not available on this device',
            });
            break;
          }
          case RESULTS.DENIED: {
            this.setState({
              hasPermission: false,
              showScannerView: false,
              loadingCamera: false,
              showDialogue: true,
              onPressActionButton: () => {
                if (isIos) {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
              actionButtonText: 'Settings',
              dialogueDescriptionText: 'Please enable permission from settings',
            });
            break;
          }
          case RESULTS.LIMITED: {
            this.setState({
              hasPermission: true,
              showScannerView: true,
              loadingCamera: false,
              dialogueDescriptionText: 'Only limited permission available',
            });
            break;
          }
          case RESULTS.GRANTED: {
            this.setState({
              hasPermission: true,
              showScannerView: true,
              loadingCamera: false,
            });
            break;
          }
          case RESULTS.BLOCKED: {
            this.setState({
              hasPermission: false,
              showScannerView: false,
              loadingCamera: false,
              showDialogue: true,
              onPressActionButton: () => {
                console.log('asking');
                Linking.openURL('app-settings:');
              },
              actionButtonText: 'Settings',
              dialogueDescriptionText: 'Please enable permission from settings',
            });
            break;
          }
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  componentDidMount() {
    this.checkForPermission();
  }

  componentWillUnmount() {
    clearTimeout(this.imageProcessorTimeout);
  }

  // On some android devices, the aspect ratio of the preview is different than
  // the screen size. This leads to distorted camera previews. This allows for correcting that.
  getPreviewSize() {
    const dimensions = Dimensions.get('window');
    // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
    const heightMargin =
      ((1 - this.state.device.previewHeightPercent) * dimensions.height) / 2;
    const widthMargin =
      ((1 - this.state.device.previewWidthPercent) * dimensions.width) / 2;
    if (dimensions.height > dimensions.width) {
      // Portrait
      return {
        height: this.state.device.previewHeightPercent,
        width: this.state.device.previewWidthPercent,
        marginTop: heightMargin,
        marginLeft: widthMargin,
      };
    }

    //Landscape;
    return {
      width: this.state.device.previewHeightPercent,
      height: this.state.device.previewWidthPercent,
      marginTop: widthMargin,
      marginLeft: heightMargin,
    };
  }

  // Capture the current frame/rectangle. Triggers the flash animation and shows a
  // loading/processing state. Will not take another picture if already taking a picture.
  capture = () => {
    if (this.state.takingPicture) return;
    if (this.state.processingImage) return;
    this.setState({takingPicture: true, processingImage: true});
    this.camera.current.capture();
    this.triggerSnapAnimation();

    // If capture failed, allow for additional captures
    this.imageProcessorTimeout = setTimeout(() => {
      if (this.state.takingPicture) {
        this.setState({takingPicture: false});
      }
    }, 100);
  };

  // The picture was captured but still needs to be processed.
  onPictureTaken = data => {
    this.setState(
      {
        image: data.croppedImage,
        initialImage: data.initialImage,
        rectangleCoordinates: data.rectangleCoordinates,
      },
      () => {
        this.setState(
          {imageWidth: data.width, imageHeight: data.height},
          () => {
            ImagePicker.openCropper({
              includeBase64: true,
              path: data.croppedImage,
              width: this.state.imageWidth,
              height: this.state.imageHeight,
            })
              .then(image => {
                this.setState({
                  afterCropImage: image,
                  askForName: true,
                  processingImage: false,
                });
              })
              .catch(error => {
                this.props.setDocumentView();
              });
          },
        );
      },
    );
  };

  // Flashes the screen on capture
  triggerSnapAnimation() {
    Animated.sequence([
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0.6,
        delay: 100,
        duration: 120,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.overlayFlashOpacity, {
        toValue: 0,
        duration: 90,
        useNativeDriver: false,
      }),
    ]).start();
  }

  // Renders the camera controls. This will show controls on the side for large tablet screens
  // or on the bottom for phones. (For small tablets it will adjust the view a little bit).
  // Renders the camera controls or a loading/processing state
  renderCameraOverlay() {
    const {
      processingImage,
      renderFilters,
      takingPicture,
      loadingCamera,
      contrast,
      quality,
      saturation,
      brightness,
    } = this.state;
    return (
      <CameraOverlay
        enableTorch={this.state.torchEnable}
        onPressToggleTorch={() => {
          this.setState({torchEnable: !this.state.torchEnable});
        }}
        processingImage={processingImage}
        loadingCamera={loadingCamera}
        takingPicture={takingPicture}
        renderFilters={renderFilters}
        onBrightnessChange={value => this.setState({brightness: value})}
        onSaturationChange={value => this.setState({saturation: value})}
        onContrastChange={value => this.setState({contrast: value})}
        quality={quality}
        saturation={saturation}
        brightness={brightness}
        contrast={contrast}
        onPressCancel={this.props.setDocumentView}
        onPressCapture={this.capture}
        onPressFilters={() =>
          this.setState({renderFilters: !this.state.renderFilters})
        }
      />
    );
  }
  // Renders either the camera view, a loading state, or an error message
  // letting the user know why camera use is not allowed
  renderCameraView() {
    let message = null;
    if (this.state.loadingCamera) {
      message = (
        <View style={styles.overlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingCameraMessage}>Loading Camera</Text>
          </View>
        </View>
      );
      return <View style={styles.cameraNotAvailableContainer}>{message}</View>;
    }
    if (this.state.showScannerView) {
      const previewSize = this.getPreviewSize();
      return (
        <View
          style={{
            position: 'relative',
            marginTop: previewSize.marginTop,
            marginLeft: previewSize.marginLeft,
            height: `${previewSize.height * 100}%`,
            width: `${previewSize.width * 100}%`,
          }}>
          <DocumentScanner
            useBase64
            enableTorch={this.state.torchEnable}
            saveInAppDocument={false}
            onPictureTaken={this.onPictureTaken}
            overlayColor="rgba(255,130,0, 0.7)"
            brightness={this.state.brightness}
            saturation={this.state.saturation}
            contrast={this.state.contrast}
            quality={0.8}
            onRectangleDetect={detectedRectangle => {
              this.setState({rectangleCoordinates: detectedRectangle});
            }}
            detectionCountBeforeCapture={100}
            detectionRefreshRateInMS={50}
            onPermissionsDenied={() => console.log('Permissions Denied')}
            filterId={this.state.filterId}
            ref={this.camera}
            style={styles.scanner}
          />
          <Animated.View
            style={{
              ...styles.overlay,
              backgroundColor: 'white',
              opacity: this.state.overlayFlashOpacity,
            }}
          />
          {this.renderCameraOverlay()}
        </View>
      );
    }
  }
  render() {
    if (this.state.askForName) {
      return (
        <EnterFileName
          onPressCancel={() => this.props.setDocumentView()}
          onPressSave={fileName => {
            const filePath =
              RNFS.DocumentDirectoryPath + `/${fileName}` || 'cropped_image';
            RNFS.writeFile(
              filePath,
              this.state.afterCropImage.data,
              'base64',
            ).then(response => {
              console.log('fielPat', filePath);
              const mediaPath = isIos ? filePath : `file:///${filePath}`;
              CameraRoll.saveImageWithTag(mediaPath).then(response => {
                this.props.setDocumentView();
              });
            });
          }}
        />
      );
    }
    return (
      <View style={styles.container}>
        <DialoguePrompt
          heading={'No Permission'}
          onPressCancel={() => this.props.setDocumentView()}
          onPressActionButton={this.state.onPressActionButton}
          description={this.state.dialogueDescriptionText}
          isVisible={this.state.showDialogue}
          actionText={this.state.actionButtonText}
        />
        {!this.state.image && this.renderCameraView()}
      </View>
    );
  }
}
