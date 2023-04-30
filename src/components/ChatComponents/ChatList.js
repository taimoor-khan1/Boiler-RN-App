import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import database from '@react-native-firebase/database';


export const ChatListComponent = ({
  item,
  index,
  ChatListLengt,
  count,
  lastMessage,
  lastMessageTime,
}) => {
  const { user } = useSelector(state => state?.Auth);
  const [unReadCount, setunReadCount] = useState(0)
  const [lastMsg, setlastMsg] = useState(0)


  useEffect(() => {
    GetunReadCount(user?.id, item?.type, item?.id, setunReadCount, setlastMsg)

    // console.log("item", item)
  }, [])
  const GetunReadCount = (userId, type, Channel_id, setunReadCount, setlastMsg) => {
    console.log("User ID ", userId)
    console.log("Tyoe ID ", type)
    console.log("Cnahle Id ID ", Channel_id)

    database().ref(`channels/${type}/${Channel_id}/Users/${userId}`).on("value", snapShot => {
      console.log("snapshot", snapShot.val()) /////// hear you can get User TimeStamp
      database().ref(`channels/${type}/${Channel_id}/messages`).orderByChild('timestamp').startAt(snapShot.val() !== null ? snapShot.val().timestamp : 1).on("value", snapShot => {
        console.log("snapshot=== ", snapShot.numChildren())
        setunReadCount(snapShot.numChildren())
      })
      database().ref(`channels/${type}/${Channel_id}/messages`).orderByChild('timestamp').limitToLast(1).on("child_added", (snapShot) => {
        console.log("last msgs ====>", snapShot.val()?.type)
        const last = snapShot.val()
        setlastMsg(last) /////////////// here you can get last msg and Timestam
      })
    })

  }

  // show counter here
  const showCounter = count => {
    return (
      <View style={styless.counterWrapper}>
        <Text style={styless.counterStyle}>{count}</Text>
      </View>
    );
  };
  // render method here
  return (
    <View style={styless.chatListWrapper}>
      <View style={styless.mainWrapper(index === ChatListLengt - 1 ? 0 : 0.5)}>
        <View style={styless.firstWrapper}>
          <Image source={assets.channelLogo} />
        </View>
        <View style={styless.secondWrapper}>
          <Text numberOfLines={2} style={styless.chatListName}>
            {item?.name}
          </Text>
          {lastMsg?.type === "image" ?
            <Text numberOfLines={1} style={styless.chatListDesc}>
              Attachment
            </Text> : <Text numberOfLines={2} style={styless.chatListDesc}>
              {lastMsg !== undefined ? lastMsg?.message : ''}
            </Text>
          }

        </View>

        <View style={styless.thirdWrapper}>
          <Text numberOfLines={2} style={styless.dateStyle}>
            {lastMsg !== undefined
              ? moment(lastMsg?.timestamp).fromNow()
              : ''}
          </Text>
          {unReadCount !== 0 ? showCounter(unReadCount) : null}

        </View>
      </View>
    </View>
  );
};

const styless = StyleSheet.create({
  chatListWrapper: {
    width: '100%',
    minHeight: 60,
    marginBottom: 20,
  },
  mainWrapper: bBW => ({
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 15,
    borderBottomWidth: bBW,
    // paddingHorizontal: 10,
    borderBottomColor: colors.tabText,
  }),
  firstWrapper: {
    flex: 0.2,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondWrapper: {
    flex: 0.5,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  thirdWrapper: {
    flex: 0.35,
    paddingBottom: 20,
    // backgroundColor: "red",
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatListName: {
    color: colors.black,
    fontFamily: fonts.PoppinsMedium,
    fontSize: 14,
  },
  chatListDesc: {
    color: colors.placeHolderColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 12,
    marginTop: -5,
  },
  counterWrapper: {
    backgroundColor: colors.red,
    borderRadius: 60,
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterStyle: {
    fontSize: 10,
    color: colors.white,
    fontFamily: fonts.PoppinsRegular,
  },
  dateStyle: {
    fontFamily: fonts.PoppinsMedium,
    color: colors.placeHolderColor,
    fontSize: 12,
  },
});
