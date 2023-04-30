import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import styles from '../../assets/styles';

export const HeaderThreeComponent = ({
  text,
  desc,
  is_switch = labels.off,
  onPress,
  onSwitchPress,
  isSwitch,
}) => {
  return (
    <View style={styless.headerOneWrapper}>
      <TouchableOpacity onPress={onPress}>
        <Image source={assets.backArrow} />
      </TouchableOpacity>
      <Image
        source={assets.channelLogo}
        resizeMode="center"
        style={[styles.mL(7)]}
      />
      <View style={styless.secondWrapper}>
        <Text numberOfLines={1} style={styless.chatListName}>
          {text}
        </Text>
        <Text numberOfLines={1} style={styless.chatListDesc}>
          {desc}
        </Text>
      </View>
      <View style={styless.thirdWrapper}>
        <Text numberOfLines={1} style={styless.switchStyle}>
          {is_switch}
        </Text>
        <TouchableOpacity onPress={onSwitchPress}>
          <Image
            source={isSwitch ? assets.notificationOn : assets.notificationOff}
            resizeMode="center"
            style={[styles.height_width(30, 30), styles.mL(2)]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styless = StyleSheet.create({
  headerOneWrapper: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    alignItems: 'center',
    paddingRight: 14,
  },

  headerText: {
    marginLeft: 10,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
    fontSize: 18,
  },
  secondWrapper: {
    flex: 0.6,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  thirdWrapper: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chatListName: {
    color: colors.black,
    fontFamily: fonts.PoppinsMedium,
    fontSize: 14,
  },
  chatListDesc: {
    color: colors.placeHolderColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 12,
  },
  switchStyle: {
    fontFamily: fonts.PoppinsSemiBold,
    color: colors.paragColor,
    fontSize: 10,
  },
});
