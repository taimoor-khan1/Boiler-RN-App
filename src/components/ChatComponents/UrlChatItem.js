import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';

const {width} = Dimensions.get('window');
export const UrlCHatItemComponent = ({item, user}) => {
  return (
    <View
      style={[
        styles.alignself(
          user?.id !== item?.user_id ? 'flex-start' : 'flex-end',
        ),
      ]}>
      <View
        style={styless.UrlChatWrapper(
          colors.chatBubble,
          item?.react?.length ? 60 : 10,
        )}>
        <Text>Url Show</Text>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  UrlChatWrapper: (color, mb) => ({
    minWidth: width / 2,
    minHeight: 40,
    lineHeight: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: color,
    alignSelf: 'flex-end',
    marginBottom: mb,
    ...styles.cardShadow,
    borderWidth: 2,
    borderColor: 'black',
  }),
});
