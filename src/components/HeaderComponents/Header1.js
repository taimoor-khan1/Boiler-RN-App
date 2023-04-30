import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import assets from '../../assets/images';

export const HeaderOneComponent = ({text, onPress}) => {
  return (
    <View style={styless.headerOneWrapper}>
      {text}
      <TouchableOpacity onPress={onPress}>
        <Image source={assets.settingImage} />
      </TouchableOpacity>
    </View>
  );
};
const styless = StyleSheet.create({
  headerOneWrapper: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});
