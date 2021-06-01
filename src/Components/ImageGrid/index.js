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
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import {color} from '../../Assets/ThemeConfig/colors';
import {getScaledSize, size} from '../../Assets/ThemeConfig/mixins';
import {isIos} from '../../Assets/Utils';

export const ImageGrid = props => {
  const {images} = props;
  return (
    <FlatList
      data={images}
      contentContainerStyle={styles.listContainer}
      renderItem={({item}) => {
        if (item.name !== 'ReactNativeDevBundle.js') {
          return (
            <React.Fragment>
              <TouchableOpacity
                style={{margin: 10}}
                onPress={() => {
                  if (isIos) {
                    Linking.openURL(`photos-redirect://${item?.path}`);
                  } else {
                    Linking.openURL('content://media/internal/images/media');
                  }
                }}>
                <Image
                  style={styles.image}
                  source={{
                    uri: isIos ? item.path : `file:///${item.path}`,
                  }}
                />
                <Text style={styles.imagelabel} numberOfLines={1}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        }
      }}
      keyExtractor={item => {
        return item?.mtime;
      }}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: size.H7,
  },
  image: {
    width: isIos ? getScaledSize(5, 'H6') : Dimensions.get('screen').width / 4,
    height: getScaledSize(5, 'H7'),
    borderWidth: 1,
    borderRadius: size.H0,
    borderColor: color.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagelabel: {
    fontWeight: '700',
    width: getScaledSize(5, 'H6'),
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});
