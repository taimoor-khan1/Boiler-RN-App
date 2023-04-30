import React from 'react';
import { ImageBackground } from 'react-native';
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
import labels from '../../assets/labels';
import styles from '../../assets/styles';
import { ChatInputBoxComponent } from './ChatInputBox';

const { width, height } = Dimensions.get('window');
export const ImageCaptionModalContent = ({
  pressOnClose,
  imageUrl,
  text,
  onChange,
  sendCaptionMessage,
}) => {

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styless.container}>
        <ImageBackground
          source={assets.bgImage}
          resizeMode="cover"
          style={styless.captionModalWrapper}>
          <View style={styles.height(Platform.OS === 'android' ? 20 : 50)} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}>
            <Text
              style={{
                fontFamily: fonts.PoppinsMedium,
                fontSize: 16,
                color: colors.paragColor,
              }}>
              {labels.upload}
            </Text>
            <TouchableOpacity
              style={styless.crossBtn}
              onPress={pressOnClose}
              hitSlop={20}>
              <Image
                source={assets.closeIcon}
                style={[styles.height_width(30, 30), styless.crossStyle]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.height(30)} />
          <View style={styless.imageView}>
            <View style={styless.imagePreviewWrapper}>
              <Image
                source={{ uri: imageUrl }}
                // resizeMode="cover"
                style={styless.imageStyle}
              />
            </View>
            <View style={styless.textFieldPosition}>
              <View style={styless.aboveTextField}>
                <TextInput
                  placeholder={labels.addACaption}
                  placeholderTextColor={colors.lightGrey}
                  secureTextEntry={false}
                  style={styless.inputStyle(width / 1.4)}
                  value={text}
                  onChangeText={onChange}
                  multiline={true}
                  keyboardType="email"
                />
              </View>
              <TouchableOpacity
                onPress={sendCaptionMessage}
                style={[styles.mR(20), styles.mL(5)]}>
                <Image source={assets.sendMessageImage} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styless = StyleSheet.create({
  captionModalWrapper: {
    flex: 1,
    width: width,
  },
  crossStyle: {
    alignSelf: 'center',
    position: 'absolute',
  },
  imagePreviewWrapper: {
    width: width,
    height: 550,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  crossBtn: {
    // position: 'absolute',
    alignSelf: 'flex-end',
    // top: Platform.OS === 'ios' ? 40 : 20,
    // right: 10,
    zIndex: 100000,
    // backgroundColor: colors.lightGrey,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    ...styles.cardShadow,
  },
  inputStyle: Width => ({
    width: Width,
    paddingLeft: 0,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
    minHeight: 30,
    color: colors.paragColor,
  }),
  container: {
    flex: 1,
  },
  aboveTextField: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    height: 55,
    width: width / 1.3,
    marginLeft: 20,
  },
  imageView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textFieldPosition: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...styles.cardShadow,
    minHeight: Platform.OS === 'android' ? 60 : 70,
  },
});
