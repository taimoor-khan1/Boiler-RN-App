import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import labels from '../../assets/labels';
import { EmojiesArray, getEmojiFunction } from '../../assets/labels/localData';
import styles from '../../assets/styles';
const { width } = Dimensions.get('window');
export const ReplyChatItemComponent = ({
  item,
  onPress,
  onLongPress,
  user,
  index,
  selectedIndex,
  showReactions,
  emojiPopupWidth,
  PressOnEmoji,
  emojiOpacity,
}) => {
  // duplication removes define here
  let chars = item?.reacts?.map((item, index) => item?.react_type);
  let removeDuplicate = [...new Set(chars)];
  let counts = [];

  chars?.forEach(function (x) {
    [(counts[x] = (counts[x] || 0) + 1)];
  });
  return (
    <View
      style={styles.alignself(
        user?.id !== item?.user_id ? 'flex-start' : 'flex-end',
      )}>
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={onPress}
        activeOpacity={0.9}>
        <View
          style={[
            item?.user_id === user?.id
              ? styless.chatItemWrapper2(
                item?.type === labels.image
                  ? colors.white
                  : colors.chatBubble,
                item?.type === labels.image ? 0 : 10,
              )
              : styless.chatItemWrapper1(
                item?.type === labels.image
                  ? colors.white
                  : colors.AdminChatBubble,
                item?.type === labels.image ? 0 : 10,
              ),
          ]}>
          {item?.reply_reference !== "undefined" &&
            <>
              {
                item?.reply_reference?.type === labels.text ||
                  item?.reply_reference?.type === labels.url ? (
                  <View
                    style={
                      item?.user_id === user?.id
                        ? styless.showReplyText(colors.chatBubbleLight)
                        : styless.showReplyText2(colors.AdminChatBubbleLight)
                    }>
                    <Text style={styless.replyTitle(120)} numberOfLines={1}>
                      {item?.reply_reference?.name}
                    </Text>
                    <Text
                      style={styless.chatText(
                        item?.user_id === user?.id ? colors.white : colors.chatParag,
                      )}>
                      {item?.reply_reference?.message}
                    </Text>
                  </View>
                ) : (

                  <View
                    style={[
                      item?.user_id === user?.id
                        ? styless.showReplyText(colors.chatBubbleLight)
                        : styless.showReplyText2(colors.AdminChatBubbleLight)
                    ]

                    }>
                    <Text style={styless.replyTitle(80)} numberOfLines={1}>
                      {item?.reply_reference?.name}
                    </Text>
                    <View style={styless.imageContainer}>
                      {item?.reply_reference?.captionText !== '' ? (
                        <Text
                          numberOfLines={2}
                          style={[styless.replyDescText, styles.mT(20)]}>
                          {item?.reply_reference?.captionText}
                        </Text>
                      ) : (
                        <Text
                          style={styless.photoTitle(
                            item?.user_id === user?.id
                              ? colors.white
                              : colors.chatParag,
                          )}>
                          {labels.photo}
                        </Text>
                      )}
                      <Image
                        source={{ uri: item?.reply_reference?.message }}
                        style={[styles.height_width(50, 50), styles.bR(10)]}
                      />
                    </View>
                  </View>
                )}
            </>
          }

          <Text
            style={styless.chatText(
              item?.user_id === user?.id ? colors.white : colors.chatParag,
            )}>
            {item?.message}
          </Text>
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
                      animation={'zoomIn'}
                      key={index}
                      source={items?.image}
                      resizeMode="center"
                      style={{ opacity: emojiOpacity, marginHorizontal: 10 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          ) : null}
        </View>
      </TouchableOpacity>

      {item?.reacts?.length ? (
        <>
          {removeDuplicate?.map((items, index) => {
            return (
              <>
                {items !== undefined &&
                  <View style={styless.showEmojiWrapper1}>
                    <View style={styless.innerWrapper}>
                      <View
                        style={[
                          styles.mR(item?.reacts?.length > 1 ? 10 : 0),
                          styles.flexDirection('row'),
                          styles.alignItems('center'),
                          // styles.width(18),
                        ]}>
                        <Animated.Image
                          resizeMode="center"
                          source={getEmojiFunction(items)}
                          style={[styles.mR(counts[items] > 1 ? 2 : 0)]}
                        />
                        {counts[items] > 1 ? (
                          <Text style={[styless.emojiCountStyle,]}>{counts[items]}</Text>
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

      {item?.edit !== undefined && item?.edit == true && (
        <Text
          style={styless.edited(item?.user_id === user?.id ? 'right' : 'left')}>
          {labels.edited}
        </Text>
      )}
    </View>
  );
};

const styless = StyleSheet.create({
  chatItemWrapper1: (color, padding) => ({
    minWidth: width / 2,
    maxWidth: width / 1.1,
    minHeight: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: color,
    padding: padding,
    lineHeight: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    ...styles.cardShadow,
  }),
  chatItemWrapper2: (color, padding) => ({
    minWidth: width / 2,
    maxWidth: width / 1.1,
    minHeight: 40,
    lineHeight: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: color,
    padding: padding,
    alignSelf: 'flex-end',
    marginBottom: 10,
  }),
  chatText: color => ({
    color: color,
    minWidth: width / 2.6,
    fontSize: 12,
    lineHeight: 20,
    paddingLeft: 5,
  }),
  imageContainer: {
    minHeight: 100,
    borderRadius: 10,
  },
  showReplyText: color => ({
    backgroundColor: color,
    minHeight: 20,
    minWidth: width / 2.25,
    maxWidth: width / 1.2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  }),
  showReplyText2: color => ({
    backgroundColor: color,
    minHeight: 20,
    minWidth: width / 2.25,
    maxWidth: width / 1.2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  }),
  replyTitle: width => ({
    fontFamily: fonts.TitilliumWebBold,
    color: colors.theme_Color,
    minWidth: width,
    marginBottom: 2,
  }),
  imageContainer: {
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -20,
  },
  photoTitle: color => ({
    fontFamily: fonts.TitilliumWebBold,
    color: color,
    fontSize: 12,
  }),
  emojiWrapper: (showemojiOpacityReactions, Width) => ({
    // opacity: showReactions ? 1 : 0,
    width: Width,
    minHeight: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    ...styles.cardShadow,
    position: 'absolute',
    top: -10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10000,
    paddingVertical: 5,
    paddingHorizontal: 5,
  }),
  showEmojiWrapper1: {
    minWidth: width / 2.25,
    alignSelf: 'flex-start',
    height: 35,
    position: 'absolute',
    left: 0,
    bottom: -30,
  },
  innerWrapper: {
    backgroundColor: colors.white,
    minWidth: 35,
    height: 35,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
    ...styles.cardShadow,
    marginLeft: 10,
  },
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
  replyDescText: {
    width: width / 2,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    color: colors.white,

  },
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
});
