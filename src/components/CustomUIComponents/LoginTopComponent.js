import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';

const { width } = Dimensions.get('window');
export const LoginTopComponent = ({ title, desc, imageShow = true }) => {
  return (
    <View style={styless.boxWrapper}>
      {imageShow ? (
        <Image source={assets.logo} style={styless.imageStyle} resizeMode="contain" />

      ) : null}
      <Text style={styless.textStyle}>{title}</Text>
      <Image source={assets.lineImage} />
      <Text style={styless.desStyle}>{desc}</Text>
    </View>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxWrapper: {
    width: width / 1.2,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 30,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
  },
  imageStyle: {
    marginBottom: 15,
    width: 120,
    height: 120
  },
  desStyle: {
    fontSize: 16,
    fontFamily: fonts.PoppinsRegular,
    color: colors.paragColor,
    textAlign: 'center',
    width: 290,
    marginTop: 5,
  },
});
