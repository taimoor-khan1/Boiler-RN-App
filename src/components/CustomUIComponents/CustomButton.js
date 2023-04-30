import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import styles from '../../assets/styles';

export const CustomButtonComponent = ({
  onPress,
  text,
  width,
  bg,
  height,
  imageShow = false,
  color = colors.white,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styless.buttonWrapper(
        bg,
        width,
        height,
        imageShow ? 'row' : 'column',
      )}>
      {imageShow ? (
        <Image source={assets.plusIcon} style={styles.mR(10)} />
      ) : null}
      <Text style={styless.btnText(color)}>{text}</Text>
    </TouchableOpacity>
  );
};

const styless = StyleSheet.create({
  buttonWrapper: (bgColor, btnWidth, height, flexDirection) => ({
    width: btnWidth,
    backgroundColor: bgColor,
    minHeight: height,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: flexDirection,
  }),
  btnText: color => ({
    fontFamily: fonts.PoppinsRegular,
    color: color,
    fontSize: 16,
  }),
});
