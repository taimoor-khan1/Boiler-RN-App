import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import colors from '../../../assets/colors';
import fonts from '../../../assets/fonts';
import assets from '../../../assets/images';
import labels from '../../../assets/labels';
import styles from '../../../assets/styles';
import { ChatListComponent } from '../../../components/ChatComponents/ChatList';
import { CustomButtonComponent } from '../../../components/CustomUIComponents/CustomButton';
import { CustomTopTabComponent } from '../../../components/CustomUIComponents/CustomTopTabs';
import { HeaderOneComponent } from '../../../components/HeaderComponents/Header1';
import { StatusBarComponent } from '../../../components/StatusBar/CustomStatusBar';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import { checkToken_action, url } from '../../../config/apiActions';
import {
  CheckTokenMethod,
  UploadReceipt,
  UserDetailMethod,
} from '../../../store/actions/AuthAction';

import * as RNIap from 'react-native-iap';
import { resetRoot } from '../../../config/NavigationService';
// import {useIAP} from 'react-native-iap';

const { width, height } = Dimensions.get('window');
const TipsScreen = ({ navigation }) => {
  // Decalers all States here

  const [selectedTab, setSelectedTab] = useState(labels.tips);
  const [open, setOpen] = useState(false);
  const [freeChannels, setFreeChannels] = useState([]);
  const [paidChannels, setPaidChannels] = useState([]);
  const [userId, setUserId] = useState('');
  const [Products, setProducts] = useState([]);

  const [PurchaseToken, setPurchaseToken] = useState('');
  const [ProductId, setProductId] = useState('');
  const [PackageName, setPackageName] = useState('');
  const [error, setError] = useState('');
  const [subsActive, setSubsActive] = useState(false);
  const [Receipt, setReceipt] = useState('');
  const [buyIsLoading, setBuyIsLoading] = useState(false);
  const { user } = useSelector(state => state?.Auth);
  const dispatch = useDispatch();
  const [userToken, setUserToken] = useState(null);
  const [lastMsg, setlastMsg] = useState()
  // const [UsertimeStap, setUsertimeStap] = useState()
  // const [countUnreadMessages, setcountUnreadMessages] = useState()
  var UsertimeStap, countUnreadMessages
  console.log('user -========>', user?.role);

  let purchaseUpdateSubscription = null;

  let purchaseErrorSubscription = null;

  const itemSubs = Platform.select({
    ios: ['com.boilerroomtrades.app.monthlysub'],
    // ios: ['com.boilerroomtrades.app.YearlySub'],

    android: ['com.boilerroomtrades.app.weekly'],
  });

  const uploadReceipt = async () => {
    let data = {
      action: 'user_iap',
      price: Products[0]?.localizedPrice,
      plan: Products[0]?.subscriptionPeriodUnitIOS,
      user_id: user?.id,
      receipt: Receipt,
    };
    alert(JSON.stringify(data));
    await dispatch(
      UploadReceipt(data, () => {
        setOpen(false);
      }),
    );
    await dispatch(
      UserDetailMethod(
        data,
        () => {
          // resetRoot('TabStackScreen');
        },
        () => { },
      ),
    );
  };
  useEffect(() => {
    if (Platform.OS === "ios") {

      initilizeIAPConnection();
    }
  }, []);

  const initilizeIAPConnection = async () => {
    await RNIap.initConnection()

      .then(async connection => {
        console.log('IAP result', connection);

        getItems();
      })
      .catch(err => {
        console.warn(`IAP ERROR ${err.code}`, err.message);
      });

    // await RNIap.flushFailedPurchasesCachedAsPendingAndroid()

    //   .then(consumed => {
    //     console.log('consumed all items?', consumed);
    //   })
    //   .catch(err => {
    //     console.warn(
    //       `flushFailedPurchasesCachedAsPendingAndroid ======ERROR ${err.code}`,
    //       err.message,
    //     );
    //   });
  };

  const getItems = async () => {
    try {
      console.log('itemSubs ', itemSubs);

      const subcription = await RNIap.getSubscriptions(itemSubs);

      console.log('get Subcription ==============>', subcription);

      setProducts([...subcription]);
      // console.log("product price=====>",Products[0].localizedPrice)

      if (Products.length !== 0) {
        if (Platform.OS === 'android') {
          //Your logic here to save the products in states etc
        } else if (Platform.OS === 'ios') {
          // your logic here to save the products in states etc
          // Make sure to check the response differently for android and ios as it is different for both
        }
      }
    } catch (err) {
      console.log('IAP error', err);

      setError('errorr', err.message);
    }
  };

  useEffect(async () => {
    CheckSubcription();
    if (Platform.OS === "ios") {

      purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async purchase => {
          console.log('purchase=======>', purchase);

          const receipt = purchase.transactionReceipt;

          if (receipt) {
            try {
              if (Platform.OS === 'ios') {
                RNIap.finishTransaction(purchase.transactionId);
              } else if (Platform.OS === 'android') {
                await RNIap.consumePurchaseAndroid(purchase.purchaseToken);

                await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
              }

              await RNIap.finishTransaction(purchase, true);
            } catch (ackErr) {
              console.log('ackErr INAPP>>>>', ackErr);
            }
          }
        },
      );

      purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
        console.log('purchaseErrorListener INAPP>>>>', error);
      });

      return () => {
        if (purchaseUpdateSubscription) {
          purchaseUpdateSubscription.remove();

          purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
          purchaseErrorSubscription.remove();

          purchaseErrorSubscription = null;
        }
      };
    }
  }, []);

  const requestSubscription = async sku => {
    setBuyIsLoading(true);

    console.log('IAP req', sku);

    try {
      await RNIap.requestPurchase(sku)
        // await RNIap.requestSubscription(sku)

        .then(async result => {
          console.log('IAP req sub=========>', result);

          if (Platform.OS === 'android') {
            setPurchaseToken(result.purchaseToken);

            setPackageName(result.packageNameAndroid);

            setProductId(result.productId);

            // can do your API call here to save the purchase details of particular user
          } else if (Platform.OS === 'ios') {
            // console.log(result.transactionReceipt);
            // RNIap.validateReceiptIos({
            //   'receipt-data': Receipt,
            //   password: '61d12ee5d54c43fdb5637c7ae4a77a57',
            // })
            //   .then(success => {
            //     console.log('success=========>', success);
            //   })
            //   .catch(err => {
            //     console.log('err=========================>', err);
            //   });

            setProductId(result.productId);

            setReceipt(result.transactionReceipt);
            await uploadReceipt();

            // can do your API call here to save the purchase details of particular user
          }

          setBuyIsLoading(false);
        })

        .catch(err => {
          setBuyIsLoading(false);

          console.log(
            `IAP req ERROR %%%%% ${err.code}`,
            err,
            // isModalVisible,
          );

          setError(err.message);
        });
    } catch (err) {
      setBuyIsLoading(false);

      console.warn(`err ${err.code}`, err.message);

      setError(err.message);
    }
  };

  // console.log('user', user);
  // get channels from firebase call here
  useEffect(() => {
    checkUserDetail();
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



  useEffect(() => {
    if (userId !== '') {
      getChannelsFromFirebase();
    }
  }, [userId]);

  // check userDetail
  const checkUserDetail = async () => {
    const userDetail = await AsyncStorage.getItem('userDetail');
    setUserId(userDetail);
  };
  // check Subscription
  const CheckSubcription = async response => {
    if (user?.role === "administrator") {
      setSubsActive(true);
    }
    else {
      if (
        user?.user_current_membership === '' &&
        !user?.user_subscription_status &&
        !user?.iap_active
      ) {
        setSubsActive(false);
      } else {
        setSubsActive(true);
      }

    }

  };

  // get channels from firebase define here
  const getChannelsFromFirebase = async () => {
    await database()
      .ref(`channels/free`)
      .once('value', snapShot => {
        let freeArray = [];
        snapShot.forEach(child => {
          freeArray.push({ ...child.val(), id: child.key });
        });

        setFreeChannels(freeArray);
      });
    database()
      .ref(`channels/paid`)
      .once('value', snapShot => {
        let paidArray = [];
        snapShot.forEach(child => {
          paidArray.push({ ...child.val(), id: child.key });
        });
        setPaidChannels(paidArray);
      });

  };




  //renderItem here
  const renderItem = ({ item, index }) => {

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MainStackScreen', {
            screen: 'ChatScreen',
            params: item,
          });
        }}>
        <ChatListComponent
          item={item}
          index={index}
          ChatListLengt={
            selectedTab === labels.tips
              ? freeChannels?.length
              : paidChannels?.length
          }
          count={
            item?.members !== undefined
              ? item?.members[userId]?.un_read_count
              : 0
          }
          lastMessage={
            item?.members !== undefined
              ? item?.members[userId]?.last_message
              : ''
          }
          lastMessageTime={
            item?.members !== undefined ? item?.members[userId]?.timestamp : ''
          }
        />

      </TouchableOpacity>
    );
  };

  // childern of modal here
  const subscriptionModalContent = () => {
    return (
      <View>
        {Platform.OS === 'ios' ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styless.Packages}>
            {Products.length > 0 &&
              Products.map(i => {
                return (
                  <ScrollView
                    contentContainerStyle={styless.subscriptionWrapper1}>
                    <Image source={assets.subscriptionImage} />
                    <Text style={styless.subsTitle}>
                      {'Auto-renewable membership subscription'}
                    </Text>
                    <Text
                      style={
                        styless.subsTitle
                      }>{`1 ${i?.subscriptionPeriodUnitIOS} DURATION`}</Text>
                    <Text style={[styless.subsMsg]}>
                      {
                        'Your subscription will be charged to your iTunes account at confirmation of purchase and will automatically renew (at the duration selected) unless auto-renew is turned off at least 24 hours before the end of the current period'
                      }
                    </Text>
                    <Text style={styless.subsMsg}>
                      {
                        'Current subscription may not be cancelled during the active subscription period; however, you can manage your subscription and/or turn off auto-renewal by visiting your iTunes Account Settings after purchase'
                      }
                    </Text>
                    <Text
                      style={[styless.subsMsg, { color: colors.theme_Color }]}
                      onPress={() =>
                        Linking.openURL(
                          'https://saiyanstocks.com/disclaimer/',
                        )
                      }>
                      {'Privacy policy and terms of use'}
                    </Text>
                    <View style={styless.btnWrapper}>
                      {buyIsLoading === true ? (
                        <ActivityIndicator
                          size={'small'}
                          color={colors.white}
                        />
                      ) : (
                        <CustomButtonComponent
                          text={`${i?.localizedPrice} / ${i?.subscriptionPeriodUnitIOS}`}
                          width={width / 2}
                          height={50}
                          bg={colors.theme_Color}
                          onPress={() => {
                            requestSubscription(i?.productId);

                            // Linking.openURL(url);
                          }}
                        />
                      )}
                    </View>
                  </ScrollView>
                );
              })}
          </ScrollView>
        ) : (
          <View style={styless.subscriptionWrapper}>
            <Image source={assets.subscriptionImage} />
            <Text style={styless.subsTitle}>{labels.subscriptionExpired}</Text>
            <Text style={styless.subsMsg}>{labels.subscriptionMessage}</Text>
            <View style={styless.btnWrapper}>
              <CustomButtonComponent
                text={labels.upgrade}
                width={width / 2}
                height={50}
                bg={colors.theme_Color}
                onPress={() => {
                  Linking.openURL(url);
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  // top header title method here
  const topHeaderTitleMethod = () => {
    return (
      <View style={styless.headerTitleWrapper}>
        <Text style={styless.helloText}>{labels.hello}</Text>
        <Text>, </Text>
        <Text style={styless.nameText}>{user?.name}</Text>
      </View>
    );
  };
  // console.log('freeChannels', freeChannels);
  // console.log('Paid Channnels', paidChannels);

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
      <View style={[styles.height(40)]} />
      <HeaderOneComponent
        text={topHeaderTitleMethod()}
        onPress={() => {
          navigation.navigate('MainStackScreen', {
            screen: 'Setting',
          });
        }}
      />
      <View style={[styles.height(10)]} />
      <CustomTopTabComponent
        tab={selectedTab}
        onPress={e => {
          if (e == 0) {
            setSelectedTab(labels.tips);
            setOpen(false);
          } else {
            if (
              !subsActive

              // user?.user_current_membership === '' &&
              // !user?.user_subscription_status &&
              // !user?.iap_active
            ) {
              setSelectedTab(labels.news);
              setOpen(true);
            } else {
              setOpen(false);
              setSelectedTab(labels.news);
            }
          }
        }}
      />
      <View style={[styles.height(40)]} />
      {freeChannels?.length || paidChannels?.length ? (
        <FlatList
          data={selectedTab === labels.tips ? freeChannels : paidChannels}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          style={[
            styles.width_Percent('100%'),
            styles.flex(1),
            { zIndex: open ? -1 : 1 },
          ]}
        />
      ) : (
        <Text style={styless.noDataText}>{labels.noChannelAvailableYet}</Text>
      )}
      {open ? (
        <ImageBackground
          source={assets.ChanelPaid}
          style={
            Platform.OS === 'ios'
              ? styless.channelPaidWrapper
              : styless.channelPaidWrapper1
          }>
          {subscriptionModalContent()}
        </ImageBackground>
      ) : null}
    </ImageBackground>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {},
  Packages: {
    // flexGrow: 1,
    minHeight: 320,

    borderRadius: 15,
    width: width / 1.2,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    paddingBottom: height / 4,
  },
  subscriptionWrapper: {
    minHeight: 320,
    marginVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    width: width / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  subscriptionWrapper1: {
    minHeight: 320,
    flexGrow: 1,
    marginVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    width: width / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 70,
  },
  subsTitle: {
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  subsMsg: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.paragColor,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: -25,
    alignSelf: 'center',
  },
  channelPaidWrapper1: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: height / 1,
    top: height / 4.6,
    width: width,
    zIndex: 100,
    paddingTop: 80,
  },
  channelPaidWrapper: {
    position: 'absolute',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    height: height / 1,
    top: height / 4.6,
    width: width,
    zIndex: 100,
    // paddingTop: 80,
  },
  helloText: {
    color: colors.black,
    fontFamily: fonts.TitilliumWebRegular,
    fontSize: 18,
  },
  nameText: {
    color: colors.black,
    fontFamily: fonts.TitilliumWebBold,
    fontSize: 18,
  },
  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  noDataText: {
    color: colors.placeHolderColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TipsScreen;
