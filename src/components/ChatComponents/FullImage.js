import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import styles from '../../assets/styles';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');
export const ShowFullImageComponent = ({pressOnClose, imageUrl}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styless.container}>
        <View style={styless.captionModalWrapper}>
          <TouchableOpacity
            style={styless.crossBtn}
            onPress={pressOnClose}
            hitSlop={20}>
            <Image
              source={assets.closeIcon}
              style={[styles.height_width(40, 40), styless.crossStyle]}
            />
          </TouchableOpacity>
          <View style={styless.imageView}>
            <View style={styless.imagePreviewWrapper}>
              <FastImage
                style={styless.imageStyle}
                source={{
                  uri: imageUrl,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styless = StyleSheet.create({
  captionModalWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    width: width,
  },
  crossStyle: {
    alignSelf: 'center',
    position: 'absolute',
  },
  imagePreviewWrapper: {
    width: width - 20,
    height: 450,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  crossBtn: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 10,
    zIndex: 100000,
    backgroundColor: colors.lightGrey,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    ...styles.cardShadow,
  },
  inputStyle: Width => ({
    width: Width,
    paddingLeft: 15,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
    minHeight: 30,
    color: colors.white,
  }),
  container: {
    flex: 1,
  },
  aboveTextField: {
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    height: 55,
    width: width / 1.3,
    marginLeft: 20,
  },
  imageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFieldPosition: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
  },
});
