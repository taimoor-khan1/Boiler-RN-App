import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Linking,
} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import { EmojiesArray, getEmojiFunction } from '../../assets/labels/localData';
import styles from '../../assets/styles';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
export const ChatItemComponent = ({
  type,
  user,
  time,
  message,
  onLongPress,
  onPress,
  messageType,
  item,
  index,
  selectedIndex,
  showReactions,
  emojiPopupWidth,
  PressOnEmoji,
  emojiOpacity,
  focus,
  showImageModal,
}) => {
  // duplication removes define here
  let chars = item?.reacts?.map((item, index) => item?.react_type);
  let removeDuplicate = [...new Set(chars)];
  // let duplicateCount = removeDuplicate.forEach(element => {
  //   return {count: (count[element] || 0) + 1, reactType: element};
  // });
  let counts = [];
  chars?.forEach(function (x) {
    [(counts[x] = (counts[x] || 0) + 1)];
  });
  if (item?.type === labels.url) {
    return (
      <>
        <View
          style={[
            styles.alignself(
              user?.id !== item?.user_id ? 'flex-start' : 'flex-end',
            ),
          ]}>
          <TouchableOpacity
            onLongPress={onLongPress}
            onPress={onPress}
            activeOpacity={0.9}
            style={[
              type === user?.id
                ? styless.chatItemWrapper2(
                  messageType === labels.image
                    ? colors.white
                    : colors.chatBubble,
                  messageType === labels.image ? 0 : 10,
                  item?.react?.length ? 60 : 10,
                )
                : styless.chatItemWrapper1(
                  messageType === labels.image
                    ? colors.white
                    : colors.AdminChatBubble,
                  messageType === labels.image ? 0 : 10,
                  item?.react?.length ? 50 : 10,
                ),
            ]}>
            <View style={styless.preViewMain}>
              <View style={styless.preViewWrapper}>
                <View style={styless.bottomWrapper}>
                  {item?.linkDetail?.title !== undefined ? (
                    <Text
                      style={styless.newsTitle(
                        type === user?.id ? colors.white : colors.white,
                      )}>
                      {item?.linkDetail?.title}
                    </Text>
                  ) : null}
                  {item?.linkDetail?.description !== undefined ? (
                    <Text
                      numberOfLines={2}
                      style={styless.newsDesc(
                        type === user?.id ? colors.white : colors.white,
                      )}>
                      {item?.linkDetail?.description}
                    </Text>
                  ) : null}
                  {item?.linkDetail?.image !== undefined ? (
                    <Image
                      source={
                        item?.linkDetail?.image?.url !== undefined
                          ? { uri: item?.linkDetail?.image?.url }
                          : assets.defaultImage
                      }
                      style={styless.topImage}
                      resizeMode="cover"
                    />
                  ) : null}

                  <TouchableOpacity onPress={() => Linking.openURL(message)}>
                    <Text
                      style={[
                        styless.chatText(
                          type === user?.id ? colors.white : colors.white,
                        ),
                        {
                          marginTop: 5,
                          textDecorationLine: 'underline',
                          fontSize: 16,
                        },
                      ]}>
                      {message}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {showReactions === true && selectedIndex === index ? (
              <Animated.View
                style={[styless.emojiWrapper(emojiOpacity, emojiPopupWidth)]}>
                {EmojiesArray?.map((items, index) => {
                  let checkEmojiYour = item?.reacts?.find(
                    (item, index) => item?.user_id === user?.id,
                  );
                  return (
                    <TouchableOpacity
                      style={[
                        checkEmojiYour?.react_type === items.value
                          ? styless.selectedEmojiStyle
                          : styless.nonSelected,
                        styles.mH(10),
                      ]}
                      onPress={() =>
                        PressOnEmoji(items?.value, item?.id, item?.reacts)
                      }>
                      <Animated.Image
                        key={index}
                        source={items?.image}
                        resizeMode="contain"
                        style={{ opacity: emojiOpacity }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            ) : null}
          </TouchableOpacity>
          {item?.reacts?.length ? (
            <>
              {removeDuplicate?.map((items, index) => {
                console.log("items hy bhai items", items)
                return (
                  <>
                    {items !== undefined && items !== "undefined" &&
                      <View style={styless.showEmojiWrapper1}>
                        <View
                          style={styless.innerWrapper(
                            item?.reacts?.length === 1 ? 100 : 20,
                          )}>
                          <View
                            style={[
                              styles.mR(item?.reacts?.length > 1 ? 10 : 0),
                              styles.flexDirection('row'),
                              styles.alignItems('center'),
                            ]}>
                            <TouchableOpacity
                              onPress={() => PressOnEmoji(items, item?.id)}>
                              <Animated.Image
                                resizeMode="contain"
                                source={getEmojiFunction(items)}
                                style={[styles.mR(counts[items] > 1 ? 2 : 0)]}
                              />
                            </TouchableOpacity>
                            {counts[items] > 1 ? (
                              <Text style={[styless.emojiCountStyle]}>
                                {counts[items]}
                              </Text>
                            ) : null}
                          </View>

                        </View>
                      </View>


                    }
                  </>

                );
              })}
            </>
          ) : null}
        </View>
      </>
    );
  } else {
    return (
      <>
        <View
          style={[
            styles.alignself(
              user?.id !== item?.user_id ? 'flex-start' : 'flex-end',
            ),
          ]}>
          <TouchableOpacity
            onLongPress={onLongPress}
            onPress={onPress}
            activeOpacity={0.9}
            style={[
              type === user?.id
                ? styless.chatItemWrapper2(
                  messageType === labels.image
                    ? colors.white
                    : colors.chatBubble,
                  messageType === labels.image ? 0 : 10,
                  item?.react?.length ? 60 : 10,
                )
                : styless.chatItemWrapper1(
                  messageType === labels.image
                    ? colors.white
                    : colors.AdminChatBubble,
                  messageType === labels.image ? 0 : 10,
                  item?.react?.length ? 50 : 10,
                ),
            ]}>
            {messageType === labels.text ? (
              <Text
                style={styless.chatText(
                  type === user?.id ? colors.white : colors.chatParag,
                )}>
                {message}
              </Text>
            ) : (
              <TouchableOpacity
                onLongPress={onLongPress}
                onPress={() => {
                  showImageModal(message);
                }}
                style={styless.imageContainer}>
                <FastImage
                  style={[
                    { width: '100%', height: '100%', alignSelf: 'flex-end' },
                    styles.bR(10),
                  ]}
                  source={{
                    uri: message,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            )}
            {item?.captionText !== '' && item?.captionText !== undefined ? (
              <Text
                style={[
                  styless.chatText(colors.chatParag),
                  styles.width(width / 2),
                  { paddingHorizontal: 10, paddingBottom: 5 },
                ]}>
                {item?.captionText}
              </Text>
            ) : null}
          </TouchableOpacity>
          {item?.reacts?.length ? (
            <>
              {removeDuplicate?.map((items, index) => {
                return (
                  <>
                    {items !== undefined &&
                      <View style={styless.showEmojiWrapper1}>
                        <View
                          style={styless.innerWrapper(
                            item?.reacts?.length === 1 ? 100 : 20,
                          )}>
                          <View
                            style={[
                              styles.mR(item?.reacts?.length > 1 ? 10 : 0),
                              styles.flexDirection('row'),
                              styles.alignItems('center'),
                            ]}>
                            <TouchableOpacity
                              onPress={() => PressOnEmoji(items, item?.id)}>
                              <Animated.Image
                                resizeMode="contain"
                                source={getEmojiFunction(items)}
                                style={[styles.mR(counts[items] > 1 ? 2 : 0)]}
                              />
                            </TouchableOpacity>
                            {counts[items] > 1 ? (
                              <Text style={[styless.emojiCountStyle]}>
                                {counts[items]}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    }
                  </>
                );
              })}

            </>
          ) : null}
          {item?.edit == true && (
            <Text style={styless.edited(type === user?.id ? 'right' : 'left')}>
              {labels.edited}
            </Text>
          )}
        </View>
        {showReactions === true && selectedIndex === index ? (
          <Animated.View
            style={[styless.emojiWrapper(emojiOpacity, emojiPopupWidth)]}>
            {EmojiesArray?.map((items, index) => {
              let checkEmojiYour = item?.reacts?.find(
                (item, index) => item?.user_id === user?.id,
              );
              return (
                <TouchableOpacity
                  style={[
                    checkEmojiYour?.react_type === items.value
                      ? styless.selectedEmojiStyle
                      : styless.nonSelected,
                    styles.mH(10),
                  ]}
                  onPress={() =>
                    PressOnEmoji(items?.value, item?.id, item?.reacts)
                  }>
                  <Animated.Image
                    key={index}
                    source={items?.image}
                    resizeMode="contain"
                    style={{ opacity: emojiOpacity }}
                  />
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        ) : null}
      </>
    );
  }
};

const styless = StyleSheet.create({
  chatItemWrapper1: (color, padding, mb) => ({
    minWidth: width / 5,
    minHeight: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#efefef',
    padding: padding,
    lineHeight: 20,
    marginBottom: mb,
    alignSelf: 'flex-start',
    ...styles.cardShadow,
  }),
  chatItemWrapper2: (color, padding, mb) => ({
    minWidth: width / 4,
    minHeight: 40,
    lineHeight: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: color,
    padding: padding,
    alignSelf: 'flex-end',
    marginBottom: mb,


    ...styles.cardShadow,
  }),
  chatText: color => ({
    color: color,
    minWidth: width / 4.3,
    fontSize: 14,
    lineHeight: 20,
  }),
  edited: align => ({
    color: colors.darkGrey,
    fontSize: 12,
    // marginTop: -9,
    // marginBottom: 15,
    textAlign: align,
    position: 'absolute',
    bottom: -7,
    right: 0,
  }),
  imageContainer: {
    height: width / 2,
    width: width / 1.9,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  emojiWrapper: (showReactions, Width) => ({
    // opacity: showReactions ? 1 : 0,
    width: Width,
    minHeight: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    ...styles.cardShadow,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
    zIndex: 10000,
    left: '20%',
  }),
  showEmojiWrapper: {
    minWidth: width / 2,
    minHeight: 40,
    lineHeight: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: colors.white,
    padding: 10,
    alignSelf: 'flex-start',
    marginBottom: 100,
  },
  showEmojiWrapper1: {
    minWidth: width / 2.25,
    alignSelf: 'flex-start',
    height: 30,
    zIndex: 1,
    position: 'absolute',
    left: 0,
    bottom: -55,
    marginBottom: 30,
  },
  innerWrapper: br => ({
    backgroundColor: colors.white,
    minWidth: 35,
    height: 35,
    paddingVertical: 0,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    borderRadius: br,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
    ...styles.cardShadow,
    marginLeft: 10,
    zIndex: 1,
  }),
  emojiCountStyle: {
    fontFamily: fonts.PoppinsMedium,
    color: colors.placeHolderColor,
    fontSize: 14,
  },
  selectedEmojiStyle: {
    width: 38,
    height: 38,
    borderRadius: 60,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nonSelected: {
    width: 38,
    height: 38,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preViewWrapper: {
    width: width / 1.2,
    borderRadius: 10,
    backgroundColor: colors.chatBubble,
  },
  preViewMain: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  topImage: {
    backgroundColor: colors.orangeBlur,
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  bottomWrapper: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  newsDesc: color => ({
    fontFamily: fonts.PoppinsRegular,
    color: color,
    fontSize: 16,
  }),
  newsTitle: color => ({
    marginLeft: 0,
    marginTop: 5,
    fontFamily: fonts.TitilliumWebBold,
    color: color,
    fontSize: 16,
    marginBottom: 10,
  }),
});
