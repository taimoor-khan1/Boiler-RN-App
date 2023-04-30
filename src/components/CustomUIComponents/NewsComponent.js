import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import styles from '../../assets/styles';
import {LinkPreview} from '@flyerhq/react-native-link-preview';

const {width} = Dimensions.get('window');
export const CustomNewsComponent = ({
  admin = false,
  item,
  onDeleteNews,
  onEditNews,
}) => {
  const str = item?.link_object.toString();
  let finalData = str.replace(/\\/g, '');
  let linkObject = JSON.parse(finalData);

  return (
    <View style={[styless.newsWrapper, styles.cardShadow]}>
      <Image
        style={styless.topImage}
        source={
          linkObject?.image !== undefined
            ? {uri: linkObject?.image?.url}
            : assets.defaultImage
        }
        resizeMode={Platform.OS === 'android' ? 'contain' : 'cover'}
      />
      {admin ? (
        <View style={styless.actionBtnsWrapper}>
          <TouchableOpacity onPress={onEditNews}>
            <Image source={assets.editIcon} style={styles.mR(5)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteNews}>
            <Image source={assets.deleteIcon} />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styless.bottomWrapper}>
        {linkObject?.title !== undefined ? (
          <Text style={styless.newsTitle}>{linkObject?.title}</Text>
        ) : null}

        <Text style={styless.newsDesc}>{item?.description}</Text>

        <View style={[styles.height(25)]} />
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`${item?.news_link}`);
          }}
          style={styless.subBotomWrapper}>
          <Text style={styless.linkStyle}>
            {`${item?.news_link}`.toLowerCase()}
          </Text>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`${item?.news_link}`);
            }}>
            <Image source={assets.goArrow} style={styles.mR(-10)} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  newsWrapper: {
    width: width / 1.2,
    borderWidth: 1,
    minHeight: 300,
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 30,
  },
  topImage: {
    backgroundColor: colors.orangeBlur,
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: width / 1.2,
  },
  newsTitle: {
    fontFamily: fonts.PoppinsSemiBold,
    color: colors.black,
    marginVertical: 10,
    fontSize: 18,
  },
  newsDesc: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.newsParag,
    fontSize: 16,
  },
  bottomWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  subBotomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkStyle: {
    color: colors.newsParag,
    fontFamily: fonts.PoppinsMedium,
    fontSize: 12,
  },
  actionBtnsWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    right: 7,
    top: 7,
  },
});
