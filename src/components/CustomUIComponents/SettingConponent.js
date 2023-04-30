import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import labels from '../../assets/labels';
import {CustomSwitchComponent} from './Switch';

export const SettingComponent = ({
  active = 0.8,
  onPress,
  toggleSwitch,
  isEnabled,
  setIsEnabled,
  isToggleShow = false,
  text = '',
  isSubs = false,
  bw = 0.29,
  checkSubscription = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={active}
      style={styless.settingWrapper}>
      <View style={styless.subSettingWrapper(bw)}>
        <Text style={styless.settingText}>{text}</Text>
        {isToggleShow ? (
          <CustomSwitchComponent
            toggleSwitch={toggleSwitch}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
          />
        ) : null}
        {isSubs ? (
          <View
            style={styless.subsWrapper(
              checkSubscription !== '' ? colors.GreenColor : colors.red,
            )}>
            <Text
              numberOfLines={1}
              style={styless.subsText(
                checkSubscription !== '' ? colors.GreenColor : colors.red,
              )}>
              {checkSubscription !== ''
                ? labels.alert
                : labels.alert.replace(labels.alert, labels.expired)}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styless = StyleSheet.create({
  settingWrapper: {
    paddingHorizontal: 30,
    marginBottom: 5,
    minHeight: 45,
  },
  subSettingWrapper: bw => ({
    borderBottomWidth: bw,
    borderBottomColor: colors.placeHolderColor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  settingText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsRegular,
    color: colors.paragColor,
  },
  subsWrapper: bColor => ({
    borderWidth: 1,
    borderColor: bColor,
    minWidth: 70,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  subsText: color => ({
    fontSize: 10,
    color: color,
    fontFamily: fonts.PoppinsMedium,
  }),
});
