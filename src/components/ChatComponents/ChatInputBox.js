import React from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import styles from '../../assets/styles';

const {width} = Dimensions.get('window');
export const ChatInputBoxComponent = ({
  text,
  onChange,
  onBlur,
  onFocus,
  choosePhoto,
  onUploadSelect,
  openEmoji,
  sendMessage,
  focus,
  autoFocus,
  keyboardRef,
}) => {
  console.log('autoFocus', autoFocus);
  return (
    <View style={[styless.ChatInputBoxWrapper, styles.cardShadow]}>
      <TextInput
        ref={keyboardRef}
        placeholder={labels.writeHere}
        placeholderTextColor={colors.placeHolderColor}
        secureTextEntry={false}
        style={styless.inputStyle(width / 1.6)}
        value={text}
        onChangeText={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        multiline={true}
      />

      <View
        style={styless.sideIconsWrapper(text?.length ? 'flex-end' : 'center')}>
        <TouchableOpacity onPress={openEmoji}>
          <Image source={assets.emoji} />
        </TouchableOpacity>
        {!text?.length ? (
          <TouchableOpacity onPress={() => choosePhoto()} style={styles.mH(5)}>
            <Image source={assets.gallery} />
          </TouchableOpacity>
        ) : null}

        {text?.length ? (
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.mR(20), styles.mL(5)]}>
            <Image source={assets.sendMessageImage} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
const styless = StyleSheet.create({
  ChatInputBoxWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 15,
    // paddingTop:20,
    flexDirection: 'row',
    // ...ifIphoneX({
    //   paddingBottom: Platform.OS === 'android' ? 0 : 10,
    // }),
  },
  sideIconsWrapper: jContent => ({
    flexDirection: 'row',
    justifyContent: jContent,
    alignItems: 'center',
    flex: 1,
    // paddingBottom: 10,
    ...ifIphoneX(
      {
        paddingBottom: Platform.OS === 'android' ? 10 : 13,
      },
      {
        paddingBottom: Platform.OS === 'android' ? 10 : 10,
      },
    ),
  }),
  inputStyle: Width => ({
    width: Width,
    minHeight: 55,
    paddingLeft: 15,
    color:colors.black,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
  
    paddingTop: 15,
  }),
});
