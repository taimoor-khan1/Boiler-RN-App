import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import moment from 'moment';

const {width} = Dimensions.get('window');
export const ChatHeaderComponent = ({text, time}) => {
  var offset = new Date().getTimezoneOffset();
  // console.log('offset', offset);
  return (
    <View style={styless.chatHeaderWrapper}>
      <View style={styless.chatAvatar}>
        <Text style={styless.chatHeaderText}>{text?.charAt(0)}</Text>
      </View>
      <View style={styless.subWrapper}>
        <Text style={styless.userName}>{text}</Text>
        <Text style={styless.userTime}>
          {moment(time).zone(offset).format('hh:mm A')}
        </Text>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  chatHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width / 2,
    marginBottom: 10,
  },
  chatAvatar: {
    backgroundColor: colors.adminTop,
    width: 30,
    height: 30,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderText: {
    color: colors.white,
  },
  subWrapper: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: fonts.PoppinsMedium,
    color: colors.paragColor,
    fontSize: 12,
  },
  userTime: {
    fontFamily: fonts.PoppinsMedium,
    color: colors.placeHolderColor,
    fontSize: 10,
  },
});
