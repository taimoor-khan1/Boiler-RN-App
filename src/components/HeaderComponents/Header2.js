import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';

export const HeaderTwoComponent = ({text, onPress}) => {
  return (
    <View style={styless.headerOneWrapper}>
      <TouchableOpacity onPress={onPress}>
        <Image source={assets.backArrow} />
      </TouchableOpacity>
      <Text style={styless.headerText}>{text}</Text>
    </View>
  );
};
const styless = StyleSheet.create({
  headerOneWrapper: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    alignItems: 'center',
  },

  headerText: {
    marginLeft: 10,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
    fontSize: 18,
  },
});
