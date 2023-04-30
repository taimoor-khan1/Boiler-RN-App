import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import labels from '../../assets/labels';
import styles from '../../assets/styles';

export const CustomTopTabComponent = ({onPress, tab}) => {
  return (
    <View style={[styless.tabMaiWrapper]}>
      <View style={[styless.tabWrapper, styles.cardShadow]}>
        <TouchableOpacity
          onPress={() => onPress(0)}
          style={styless.subTabWrapper1(
            tab === labels.tips ? colors.theme_Color : colors.white,
          )}>
          <Text
            style={styless.TabText(
              tab === labels.tips ? colors.white : colors.tabText,
            )}>
            {labels.free}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(1)}
          style={styless.subTabWrapper2(
            tab === labels.news ? colors.theme_Color : colors.white,
          )}>
          <Text
            style={styless.TabText(
              tab === labels.news ? colors.white : colors.tabText,
            )}>
            {labels.paid}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  tabMaiWrapper: {
    width: '100%',
    minHeight: 48,
    paddingHorizontal: 30,
  },
  tabWrapper: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  subTabWrapper1: bgColor => ({
    flex: 0.5,
    backgroundColor: bgColor,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  }),
  subTabWrapper2: bgColor => ({
    flex: 0.5,
    backgroundColor: bgColor,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  }),
  TabText: col => ({
    color: col,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
  }),
});
