import React, { useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import colors from '../../assets/colors';
import labels from '../../assets/labels';
import { EmojiesArray, getEmojiFunction } from '../../assets/labels/localData';
import styles from '../../assets/styles';
import { ChatHeaderComponent } from './ChatHeader';
import { ChatInputBoxComponent } from './ChatInputBox';
import { ChatItemComponent } from './ChatItem';
import {
  SwipeItem,
  SwipeButtonsContainer,
  SwipeProvider,
} from 'react-native-swipe-item';
import { TouchableOpacity } from 'react-native';
import fonts from '../../assets/fonts';
import { ReplyComponent } from './ReplyComponent';
import { ReplyChatItemComponent } from './replyChatItem';
import { CustomModalComponent } from '../CustomUIComponents/CustomModal';
import { ImageCaptionModalContent } from './ImageCaption';
import Entypo from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get('window');
export const ChatBoxComponent = ({
  messages,
  user,
  message,
  setMessage,
  focus,
  onBlur,
  onFocus,
  choosePhoto,
  onUploadSelect,
  openEmoji,
  show,
  onLongPress,
  showReactions,
  selectedIndex,
  PressOnEmoji,
  onSinglePress,
  pressOnReply,
  showReply,
  onClose,
  emojiPopupWidth,
  sendMessage,
  resplyRefDetail,
  flatListRef,
  scrollToBottom,
  swipeItem,
  emojiOpacity,
  pressOnDelete,
  imageCaptionModal,
  setImageCaptionModal,
  selectedImage,
  captionText,
  setCaptionText,
  pressOnCaptionImage,
  messageEditPress,
  autoFocus,
  setAutoFocus,
  showImageModal,
  keyboardRef,
  itemRef,
}) => {
  //render chat item of chat box here
  const renderItem = ({ item, index }) => {
    let checkIndex = messages?.find((_, subIndex) => subIndex === index - 1);
    if (item?.status === 'remove') {
      return (
        <View style={styless.deletedChatItem(user?.id !== item?.user_id)}>
          <Text style={styless.deleteTextStyle(user?.id !== item?.user_id)}>
            {labels.youDeleteThisMessage}
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity activeOpacity={1} onPress={onSinglePress}>
          {user?.id !== item?.user_id ? (
            checkIndex?.user_id === item?.user_id ? null : (
              <ChatHeaderComponent text={item?.name} time={item?.timeStamp} />
            )
          ) : null}
          <SwipeItem
            style={
              item?.user_id === user?.id ? styless.button2 : styless.button1
            }
            ref={itemRef}
            swipeContainerStyle={[styless.swipeContentContainerStyle]}
            leftButtons={
              user?.role === labels.administrator &&
                user?.id !== item?.user_id ? (
                <SwipeButtonsContainer style={styless.rightBtn}>
                  <TouchableOpacity
                    onPress={() => {
                      pressOnDelete(item?.id);
                    }}>
                    <Text style={styless.deleteText}>{labels.delete}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={itemRef => {
                      pressOnReply(item);
                      // itemRef?.current?.close();
                      console.log(
                        'refffff',
                        itemRef?.current?.context?.setOpenedItemRef(),
                      );
                    }}>
                    <Text style={styless.replyText}>{labels.reply}</Text>
                  </TouchableOpacity>
                </SwipeButtonsContainer>
              ) : (
                <SwipeButtonsContainer></SwipeButtonsContainer>
              )
            }
            rightButtons={
              user?.role === labels.administrator &&
                user?.id === item?.user_id ? (
                <SwipeButtonsContainer style={styless.rightBtn}>
                  <TouchableOpacity
                    onPress={() => {
                      pressOnDelete(item?.id);
                    }}>
                    <Text style={styless.deleteText}>{labels.delete}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      pressOnReply(item);
                      // itemRef?.current?.close();
                      console.log(
                        'refffff',
                        itemRef?.current?.context?.setOpenedItemRef(),
                      );
                    }}>
                    <Text style={styless.replyText}>{labels.reply}</Text>
                  </TouchableOpacity>
                </SwipeButtonsContainer>
              ) : (
                <SwipeButtonsContainer></SwipeButtonsContainer>
              )
            }>
            {item?.user_id === user?.id &&
              item?.type !== labels.url &&
              item?.type !== labels.image ? (
              <TouchableOpacity
                onPress={() => {
                  messageEditPress(item);
                  setAutoFocus(true);
                }}
                style={styless.editIcon}>
                <Entypo name="pencil" size={20} />
              </TouchableOpacity>
            ) : null}
            {item?.reply_reference !== undefined && item?.reply_reference !== "undefined" ? (

              <ReplyChatItemComponent
                item={item}
                onLongPress={() => onLongPress(index)}
                onPress={onSinglePress}
                user={user}
                index={index}
                selectedIndex={selectedIndex}
                showReactions={showReactions}
                emojiPopupWidth={emojiPopupWidth}
                PressOnEmoji={PressOnEmoji}
                emojiOpacity={emojiOpacity}
              />
            ) : (
              <ChatItemComponent
                type={item?.user_id}
                user={user}
                time={item?.time}
                message={item?.message}
                onLongPress={() => onLongPress(index)}
                onPress={onSinglePress}
                messageType={item?.type}
                item={item}
                index={index}
                selectedIndex={selectedIndex}
                showReactions={showReactions}
                emojiPopupWidth={emojiPopupWidth}
                PressOnEmoji={PressOnEmoji}
                emojiOpacity={emojiOpacity}
                focus={focus}
                showImageModal={showImageModal}
              />
            )}
          </SwipeItem>
          {item?.reacts?.length || item?.edit ? (
            <View style={styles.height(20)} />
          ) : null}
        </TouchableOpacity>
      );
    }
  };

  //render method here
  return (
    <View style={[styless.ChatBoxWrapper]}>
      <View style={[styles.flex(1), styles.pT(10)]}>
        <SwipeProvider mode="single">
          <FlatList
            inverted
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            onContentSizeChange={() => scrollToBottom()}
            contentContainerStyle={[
              styles.pH(20),
              showReply ? styles.pT(200) : styles.pT(30),
              styles.pB(10),
            ]}
            showsVerticalScrollIndicator={false}
          />
        </SwipeProvider>
      </View>
      {user?.role === labels.administrator ? (
        <View style={styles.height(52)} />
      ) : null}
      {user?.role === labels.administrator ? (
        <View style={styless.bottomInputWrapper}>
          {showReply ? (
            <View style={styles.mV(10)}>
              <ReplyComponent onClose={onClose} data={resplyRefDetail} />
            </View>
          ) : null}
          <ChatInputBoxComponent
            text={message}
            onChange={setMessage}
            onBlur={onBlur}
            focus={focus}
            onFocus={onFocus}
            choosePhoto={choosePhoto}
            onUploadSelect={onUploadSelect}
            openEmoji={openEmoji}
            sendMessage={sendMessage}
            autoFocus={autoFocus}
            keyboardRef={keyboardRef}
          />
        </View>
      ) : null}
      <CustomModalComponent
        open={imageCaptionModal}
        setOpen={setImageCaptionModal}
        childern={
          <ImageCaptionModalContent
            pressOnClose={setImageCaptionModal}
            imageUrl={selectedImage}
            text={captionText}
            onChange={setCaptionText}
            sendCaptionMessage={pressOnCaptionImage}
          />
        }
      />
    </View>
  );
};

const styless = StyleSheet.create({
  ChatBoxWrapper: {
    flex: 1,
    backgroundColor: colors.whiteTr,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
  },
  container: {
    flex: 0.5,
  },
  button1: {
    flex: 0.2,
    minWidth: width / 2,
    alignSelf: 'flex-start',

    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    flex: 0.2,
    minWidth: width / 2,
    alignSelf: 'flex-end',
    alignItems: 'center',

    justifyContent: 'center',
  },
  swipeContentContainerStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 0,
  },
  deleteText: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.red,
    fontSize: 14,
    paddingRight: 10,
  },
  replyText: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.paragColor,
    fontSize: 14,
    borderLeftWidth: 1,
    borderLeftColor: colors.placeHolderColor,
    paddingLeft: 10,
  },
  emojiWrapper: (showReactions, Width) => ({
    // opacity: showReactions ? 1 : 0,
    width: Width,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    ...styles.cardShadow,
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
    alignSelf: 'center',
    right: 0,
  }),
  bottomInputWrapper: {
    position: 'absolute',
    bottom: 5,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 68,

    alignItems: 'center',

    width: width,
  },
  rightBtn: {
    alignSelf: 'center',
    aspectRatio: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  showEmojiWrapper: {
    minWidth: width / 2,
    padding: 10,
    alignSelf: 'flex-end',
  },
  innerWrapper: {
    backgroundColor: colors.white,
    minWidth: 20,
    padding: 5,
    alignSelf: 'flex-start',
    marginTop: -30,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletedChatItem: userState => ({
    width: width / 2,
    minHeight: 40,
    backgroundColor: userState ? colors.AdminChatBubble : colors.chatBubble,
    borderTopLeftRadius: userState ? 0 : 15,
    borderTopRightRadius: userState ? 15 : 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: userState ? 'flex-start' : 'flex-end',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  deleteTextStyle: userState => ({
    fontSize: 12,
    fontFamily: fonts.PoppinsRegular,
    color: userState ? colors.paragColor : colors.white,
  }),
  editIcon: {
    position: 'absolute',
    zIndex: 1000000,
    padding: 10,
    left: -25,
    top: -20,
  },
});
