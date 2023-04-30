import React, { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import assets from '../../../assets/images';
import labels from '../../../assets/labels';
import styles from '../../../assets/styles';
import { ChatBoxComponent } from '../../../components/ChatComponents/ChatBox';
import { HeaderThreeComponent } from '../../../components/HeaderComponents/Header3';
import { StatusBarComponent } from '../../../components/StatusBar/CustomStatusBar';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
// import EmojiBoard from 'react-native-emoji-board';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChangeChannelNotificationStatusMethod,
  GetChannelNotificationStatusMethod,
  SendMessageNotificationMethod,
} from '../../../store/actions/ChannelAction';
import {
  change_channel_notification,
  checkToken_action,
  get_channel_notification_status,
  send_notification,
} from '../../../config/apiActions';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import EmojiBoard from '../../../components/Emojiboard';
import { isValidURL } from '../../../config/Utility';
import { getPreviewData } from '@flyerhq/react-native-link-preview';
import { CustomModalComponent } from '../../../components/CustomUIComponents/CustomModal';
import { ShowFullImageComponent } from '../../../components/ChatComponents/FullImage';
import { getFCMToken } from '../../../config/fcmToken';
import { CheckTokenMethod } from '../../../store/actions/AuthAction';

let emojies = [];
const { width } = Dimensions.get('window');
const ChatScreen = ({ navigation, route }) => {
  // Declare all states here
  const [isSwitch, setISSwitch] = useState(false);
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [emojiPopupWidth, setEmojiPopupWidth] = useState(new Animated.Value(0));
  const [emojiOpacity, setEmpojiOpacity] = useState(new Animated.Value(0));
  const { user } = useSelector(state => state?.Auth);
  const { id, members, name, type } = route?.params;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [membersArray, setMembers] = useState([]);
  const [resplyRefDetail, setReplyRefDetail] = useState(null);
  const flatListRef = useRef(null);
  const swipeItem = useRef(null);
  const [imageCaptionModal, setImageCaptionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageName, setSelectedImageName] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [editMessage, setEditMessage] = useState(null);
  const [autoFocus, setAutoFocus] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const keyboardRef = useRef(null);
  const [userToken, setUserToken] = useState(null);
  const itemRef = useRef(null);

  // check here notification in ON / OFF
  useEffect(() => {
    let data = {
      action: get_channel_notification_status,
      user_id: user?.id,
      channel_id: id,
    };
    dispatch(
      GetChannelNotificationStatusMethod(
        data,
        data => {
          if (Number(data?.notification_status) === 1) {
            setISSwitch(true);
          } else {
            setISSwitch(false);
          }
        },
        () => { },
      ),
    );
    global.channelId = id;
  }, []);

  useEffect(() => {
    navigation?.addListener('focus', () => {
      if (user !== null) {
        var inter = setInterval(() => {
          let data = {
            user_id: user?.id,
            action: checkToken_action,
            token: user?.token,
          };
          // console.log('params', data);
          dispatch(
            CheckTokenMethod(data, () => {
              clearInterval(inter);
            }),
          );
        }, 15000);
      }
    });
  }, []);

  // emoji view animation start here
  useEffect(() => {
    if (showReactions === true) {
      stratAnimation();
      setTimeout(() => {
        setShowReactions(false);
        setEmojiPopupWidth(new Animated.Value(0));
        setEmpojiOpacity(new Animated.Value(0));
      }, 5000);
    }
  }, [showReactions]);

  // this useHook use for fetching all messages
  useEffect(() => {
    getAllMessagesMethod();
    return () => {
      database().ref(`channels/${type}/${id}/messages`).off('value');
      database().ref(`channels/${type}/${id}/messages`).off('child_changed');
    };
  }, []);

  useEffect(() => {
    if (imageUrl !== null) {
      setImageModal(true);
    }
  }, [imageUrl]);

  // // when some thing change this is run
  const scrollToBottom = () => {
    // console.log('flatListRef?.current?.scrollToEnd', flatListRef?.current);
    // flatListRef?.current?.scrollToEnd({animating: false});
  };

  // // close swipe item here
  const closeSwipeItem = () => {
    swipeItem && swipeItem?.current?.close();
  };

  // get reacts in array form here
  const getReacts = reacts => {
    let array = [];
    for (var key in reacts) {
      reacts[key].user_id = key;
      array.push(reacts[key]);
    }
    return array;
  };

  // get messages method define here
  const getAllMessagesMethod = () => {
    database()
      .ref(`channels/${type}/${id}/messages`)
      .on('value', snapShot => {
        let messagesArray = [];
        snapShot.forEach(function (child) {
          messagesArray?.push({ ...child.val(), id: child.key }); // NOW THE CHILDREN PRINT IN ORDER
        });
        let againMappedForReact = messagesArray?.map((item, index) => {
          if (item?.reacts !== undefined) {
            return {
              ...item,
              reacts: getReacts(item?.reacts),
            };
          } else {
            return { ...item, reacts: [] };
          }
        });
        let filteredOutDeleteMessages = againMappedForReact?.filter(
          item => item?.status !== 'remove',
        );
        setMessages(filteredOutDeleteMessages.reverse());
        setMessage(null);
        setShowReply(false);
        setReplyRefDetail(null);
        setSelectedImage('');
        setCaptionText('');
        setSelectedImageName('');
        setImageCaptionModal(false);
        setAutoFocus(false);
        emojies = [];
        database().ref(`channels/${type}/${id}/members/${user?.id}`).update({
          un_read_count: 0,
        });
        database().ref(`channels/${type}/${id}/Users/${user?.id}`).update({
          timestamp: database.ServerValue.TIMESTAMP,
        });
      });
    database()
      .ref(`channels/${type}/${id}/messages`)
      .orderByChild('timestamp')
      .on('child_changed', snapShot2 => {
        let changeMesageObject = snapShot2.val();
        let changeMessageId = snapShot2.key;
        let reactObj = snapShot2.val().reacts;
        let emojiArray = [];
        if (reactObj === undefined) {
          if (changeMesageObject?.status === 'remove') {
            let messagesItem = {
              ...changeMesageObject,
              id: changeMessageId,
              reacts: emojiArray,
            };
            setMessages(prev => {
              let mappedOut = prev?.map((item, index) => {
                if (item?.id === changeMessageId) {
                  return messagesItem;
                } else {
                  return item;
                }
              });
              return [...mappedOut];
            });
          } else {
            let emojiArray = [];
            if (reactObj !== undefined) {
              for (var key in reactObj) {
                reactObj[key].user_id = key;
                emojiArray.push(reactObj[key]);
              }
            }
            let messagesItem = {
              ...changeMesageObject,
              id: changeMessageId,
              reacts: emojiArray,
            };

            setMessages(prevMessages => {
              return [...prevMessages, messagesItem];
            });
            setMessage(null);
            setShowReply(false);
            setReplyRefDetail(null);
            emojies = [];
            scrollToBottom();
            database()
              .ref(`channels/${type}/${id}/members/${user?.id}`)
              .update({
                un_read_count: 0,
              });
          }
        } else {
          for (var key in reactObj) {
            reactObj[key].user_id = key;
            emojiArray.push(reactObj[key]);
          }
          let changeMessageItem = {
            ...changeMesageObject,
            id: changeMessageId,
            reacts: emojiArray,
          };
          setMessages(prev => {
            let mappedOut = prev?.map((item, index) => {
              if (item?.id === changeMessageId) {
                return changeMessageItem;
              } else {
                return item;
              }
            });
            return [...mappedOut];
          });
        }
      });

    // here we get all members ids
    let dummyArray = [];
    for (var key in members) {
      members[key].memberId = key;
      dummyArray.push(key);
    }
    setMembers(dummyArray);
  };

  // send message to channel method define here
  const sendMessage = async (message, messageType) => {
    console.log('message', message);
    let messageObj = {};
    setMessage(null);
    if (editMessage !== null) {
      database()
        .ref(`channels/${type}/${id}/messages/${editMessage?.id}`)
        .update({
          message,
          edit: true,
          timeStamp: database.ServerValue.TIMESTAMP,
        })
        .then(() => {
          setShowReactions(false);
          setSelectedIndex(null);
          setEmojiPopupWidth(new Animated.Value(0));
          setEmpojiOpacity(new Animated.Value(0));
          setEditMessage(null);
          setMessage(null);
        })
        .catch(err => {
          console.log('error', err);
        });
    } else {
      if (isValidURL(message) === true && messageType != 'image') {
        messageObj = {
          message: message.toLowerCase(),
          name: user?.name,
          status: 'active',
          type: labels.url,
          user_id: user?.id,
          timestamp: database.ServerValue.TIMESTAMP,
          reply_reference: undefined,
          reacts: undefined,
          linkDetail: {
            title: (await getPreviewData(`${message}`)).title,
            description: (await getPreviewData(`${message}`)).description,
            image: (await getPreviewData(`${message}`)).image,
          },
        };
      } else {
        if (showReply) {
          messageObj = {
            message: message,
            name: user?.name,
            status: 'active',
            type: messageType,
            user_id: user?.id,
            reply_reference: resplyRefDetail,
            timestamp: database.ServerValue.TIMESTAMP,
            reacts: undefined,
            linkDetail: undefined,
          };
        } else {
          messageType === labels.image
            ? (messageObj = {
              message: message,
              captionText: captionText,
              name: user?.name,
              status: 'active',
              type: messageType,
              user_id: user?.id,
              timestamp: database.ServerValue.TIMESTAMP,
              reply_reference: undefined,
              reacts: undefined,
              linkDetail: undefined,
            })
            : (messageObj = {
              message: message,
              name: user?.name,
              status: 'active',
              type: messageType,
              user_id: user?.id,
              timestamp: database.ServerValue.TIMESTAMP,
              reply_reference: undefined,
              reacts: undefined,
              linkDetail: undefined,
            });
        }
      }
    }
    database().ref(`channels/${type}/${id}/Users/${user?.id}`).update({
      timestamp: database.ServerValue.TIMESTAMP,
    });
    // membersArray?.map(item => {
    //   database()
    //     .ref(`channels/${type}/${id}/members/${item}`)
    //     .once('value', snapShot => {
    //       database()
    //         .ref(`channels/${type}/${id}/members/${item}/`)
    //         .update({
    //           un_read_count: Number(snapShot.val().un_read_count) + 1,
    //           last_message: message,
    //           timestamp: database.ServerValue.TIMESTAMP,
    //         });
    //     });
    // });
    await database().ref(`channels/${type}/${id}/messages/`).push(messageObj);
    let data = {
      action: send_notification,
      channel_id: id,
      user_id: user?.id,
      message: captionText == '' ? message : captionText,
      type: captionText == '' ? messageType : 'Text',
    };
    dispatch(
      SendMessageNotificationMethod(
        data,
        () => { },
        () => { },
      ),
    );
  };

  // send emoji on selected message define here
  const sendEmojiOnMessage = (name, chatId) => {
    database()
      .ref(`channels/${type}/${id}/messages/${chatId}/reacts/${user?.id}`)
      .update({
        react_type: name,
        timeStamp: database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        setShowReactions(false);
        setSelectedIndex(null);
        setEmojiPopupWidth(new Animated.Value(0));
        setEmpojiOpacity(new Animated.Value(0));
      })
      .catch(err => {
        console.log('error', err);
      });
  };
  // send emoji on selected message define here
  const sendEmojiUndo = chatId => {
    database()
      .ref(`channels/${type}/${id}/messages/${chatId}/reacts/${user?.id}`)
      .remove()
      .then(() => { });
  };
  // delete chat item define method here
  const deleteChatItemMethod = chatId => {
    database().ref(`channels/${type}/${id}/messages/${chatId}`).update({
      status: 'remove',
      timeStamp: database.ServerValue.TIMESTAMP,
    });
  };

  // animation func
  const stratAnimation = () => {
    Animated.sequence([
      Animated.timing(emojiPopupWidth, {
        toValue: width / 1.9,
        duration: 600,
        easing: Easing.bezier(0, 1.19, 0.74, 1.2),
        useNativeDriver: false,
      }),
      Animated.timing(emojiOpacity, {
        toValue: 1,
        duration: 600,
      }),
    ]).start();
  };

  // select photo from gallrey
  const choosePhoto = (index, type) => {
    setShowReactions(false);
    setSelectedIndex(null);
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      setShowReactions(false);
      setSelectedIndex(null);
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        const formData = new FormData();
        formData.append('avatar', {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        });
        setSelectedImage(response.assets[0].uri);
        setSelectedImageName(response.assets[0].fileName);
        setImageCaptionModal(true);
      }
    });
  };

  // send image in chat define here
  const sendImageInChatMethod = (path, name) => {
    let ref = storage()?.ref(name);
    let task = ref?.putFile(path);
    task
      .then(async data => {
        const url = await ref
          .getDownloadURL()
          .catch(error => console.log('error', error));
        sendMessage(url, labels.image);
      })
      .catch(e => {
        console.log('uploading image error => ', e);
      });
  };

  // select file here
  const onUploadSelect = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
      const obj = {
        chatImage: {
          uri: pickerResult.uri,
          type: pickerResult.type,
          name: pickerResult.name,
        },
      };
    } catch (e) {
      console.log(e, 'error');
      // handleError(e)
    }
  };

  //selected emoji
  const onClick = emoji => {
    if (message?.length && !emojies?.length) {
      emojies?.push(message);
      emojies.push(emoji?.code);
      emojies?.join('');
      let str = emojies?.join('')?.toString();
      setMessage(str);
    } else {
      emojies.push(emoji?.code);
      emojies?.join('');
      let str = emojies?.join('')?.toString();
      setMessage(str);
    }
  };

  // set channel notification method define here
  const setChannelNotificationMethod = () => {
    let data = {
      action: change_channel_notification,
      channel_id: id,
      user_id: user?.id,
      notification_status: isSwitch ? 0 : 1,
    };
    dispatch(
      ChangeChannelNotificationStatusMethod(
        data,
        success => {
          if (Number(success?.notification_status) === 1) {
            setISSwitch(true);
          } else {
            setISSwitch(false);
          }
        },
        () => { },
      ),
    );
  };

  // when edit the message keyboard by defualt focused
  const openKeyBoard = () => {
    keyboardRef?.current?.focus();
  };

  // render method here
  return (
    <ImageBackground
      source={assets.bgImage}
      resizeMode="cover"
      style={styless.container}>
      <StatusBarComponent
        bgColor={'transparent'}
        barStyle={labels.darkContent}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styless.container}>
        <View style={styles.height(40)} />
        <HeaderThreeComponent
          text={name}
          desc={members[user?.id]?.last_message}
          is_switch={!isSwitch ? labels.off : labels.on}
          onPress={() => {
            database().ref(`channels/${type}/${id}/Users/${user?.id}`).update({
              timestamp: database.ServerValue.TIMESTAMP,
            });
            navigation.goBack();
          }}
          onSwitchPress={() => {
            setChannelNotificationMethod();
          }}
          isSwitch={isSwitch}
        />
        <View style={styles.height(20)} />
        <ChatBoxComponent
          messages={messages}
          user={user}
          message={message}
          setMessage={e => {
            if (e == '') {
              emojies = [];
              setMessage(null);
            } else {
              if (emojies?.length) {
                emojies.push(e);
                let str = emojies?.join('')?.toString();
                setMessage(str);
              }
              setMessage(e);
            }
          }}
          focus={focus}
          onFocus={e => {
            setShow(false);
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          choosePhoto={choosePhoto}
          onUploadSelect={onUploadSelect}
          openEmoji={() => {
            Keyboard.dismiss();
            setShow(!show);
            setShowReactions(false);
            setEmojiPopupWidth(new Animated.Value(0));
            setEmpojiOpacity(new Animated.Value(0));
            setSelectedIndex(null);
          }}
          show={show}
          onLongPress={index => {
            if (showReactions === false) {
              setShowReactions(true);
              setSelectedIndex(index);
            }
          }}
          onSinglePress={() => {
            setShowReactions(false);
            setSelectedIndex(null);
            setShow(false);
            setEmojiPopupWidth(new Animated.Value(0));
            setEmpojiOpacity(new Animated.Value(0));
          }}
          showReactions={showReactions}
          selectedIndex={selectedIndex}
          PressOnEmoji={(emojiName, chatId, reactsLength) => {
            console.log('reacts', reactsLength);
            const findObjById = reactsLength?.find(
              item => item?.user_id === user?.id,
            );
            if (findObjById?.react_type === emojiName) {
              setShowReactions(false);
              sendEmojiUndo(chatId);
            } else {
              setShowReactions(false);
              sendEmojiOnMessage(emojiName, chatId);
            }
          }}
          pressOnReply={item => {
            setShowReply(true);
            setReplyRefDetail(item);
            closeSwipeItem();
          }}
          showReply={showReply}
          onClose={() => {
            setShowReply(false);
          }}
          emojiPopupWidth={emojiPopupWidth}
          sendMessage={() => {
            sendMessage(message, labels.text);
          }}
          resplyRefDetail={resplyRefDetail}
          flatListRef={flatListRef}
          scrollToBottom={scrollToBottom}
          swipeItem={swipeItem}
          emojiOpacity={emojiOpacity}
          pressOnDelete={chatId => {
            deleteChatItemMethod(chatId);
          }}
          imageCaptionModal={imageCaptionModal}
          setImageCaptionModal={() => {
            setImageCaptionModal(false);
          }}
          selectedImage={selectedImage}
          captionText={captionText}
          setCaptionText={e => setCaptionText(e)}
          pressOnCaptionImage={() => {
            sendImageInChatMethod(selectedImage, selectedImageName);
            setImageCaptionModal(false);
          }}
          messageEditPress={data => {
            console.log('edit data', data);
            setMessage(data?.message);
            setEditMessage(data);
            openKeyBoard();
          }}
          autoFocus={autoFocus}
          setAutoFocus={boolValue => {
            setAutoFocus(boolValue);
          }}
          keyboardRef={keyboardRef}
          showImageModal={url => {
            setImageUrl(url);
          }}
          itemRef={itemRef}
        />

        {show ? <>

          <EmojiBoard showBoard={show} onClick={onClick} />


        </>
          : null}

        <CustomModalComponent
          open={imageModal}
          setOpen={setImageModal}
          childern={
            <ShowFullImageComponent
              imageUrl={imageUrl}
              pressOnClose={() => {
                setImageModal(false);
                setImageUrl(null);
              }}
            />
          }
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ChatScreen;
