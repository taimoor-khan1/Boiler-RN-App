import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import styles from '../../assets/styles';

const {width} = Dimensions.get('window');
export const ReplyComponent = ({onClose, data}) => {
  return (
    <View style={styless.replyWrapper}>
      <Text numberOfLines={1} style={styless.replyTitle}>
        {data?.name}
      </Text>
      {data?.type === labels.text || data?.type === labels.url ? (
        <Text numberOfLines={3} style={styless.replyDesc}>
          {data?.message}
        </Text>
      ) : (
        <View style={styless.imageContainer}>
          {data?.captionText !== '' ? (
            <Text
              numberOfLines={2}
              style={[styless.replyDescText, styles.mT(20)]}>
              {data?.captionText}
            </Text>
          ) : (
            <Text style={styless.photoTitle}>{labels.photo}</Text>
          )}
          <Image
            source={{uri: data?.message}}
            style={[styles.height_width(50, 50), styles.bR(10)]}
          />
        </View>
      )}
      <View style={styless.closeWrapper}>
        <TouchableOpacity onPress={onClose}>
          <Image
            source={assets.closeIcon}
            style={styles.height_width(30, 30)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  replyWrapper: {
    width: width / 1.3,
    backgroundColor: colors.AdminChatBubble,
    minHeight: 50,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  replyDesc: {
    width: width / 1.5,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    color: colors.paragColor,
  },
  replyDescText: {
    width: width / 2,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    color: colors.paragColor,
  },
  replyTitle: {
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
  },
  photoTitle: {
    fontFamily: fonts.TitilliumWebBold,
    color: colors.paragColor,
  },
  closeWrapper: {
    position: 'absolute',
    alignSelf: 'flex-start',
    top: 5,
    right: 5,
    backgroundColor: colors.tabText,
    borderRadius: 60,
  },
  imageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -20,
    marginRight: -30,
  },
});
