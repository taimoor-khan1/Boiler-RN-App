import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { Text, View } from 'react-native';
import colors from '../../../assets/colors';
import fonts from '../../../assets/fonts';
import assets from '../../../assets/images';
import labels from '../../../assets/labels';
import styles from '../../../assets/styles';
import { SettingComponent } from '../../../components/CustomUIComponents/SettingConponent';
import { HeaderTwoComponent } from '../../../components/HeaderComponents/Header2';
import { StatusBarComponent } from '../../../components/StatusBar/CustomStatusBar';
import { resetRoot } from '../../../config/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { CustomModalComponent } from '../../../components/CustomUIComponents/CustomModal';
import { CustomButtonComponent } from '../../../components/CustomUIComponents/CustomButton';
import * as RNIap from 'react-native-iap';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  DeleteMethod,
  SignUpApiMethod,
  UploadReceipt,
  UserDetailMethod,
} from '../../../store/actions/AuthAction';

const { width } = Dimensions.get('window');

const SettingScreen = ({ navigation }) => {
  // all states declare here
  const [isEnabled, setIsEnabled] = useState(false);
  const { user } = useSelector(state => state?.Auth);
  const [open, setOpen] = useState(false);
  const [openDeacativate, setOpenDeacativate] = useState(false);
  const [status, setStatus] = useState('');
  const [Products, setProducts] = useState([]);
  const [purchase, setPurchase] = useState('');
  const [PurchaseToken, setPurchaseToken] = useState('');
  const [ProductId, setProductId] = useState('');
  const [PackageName, setPackageName] = useState('');
  const [error, setError] = useState('');
  const [buyIsLoading, setBuyIsLoading] = useState(false);
  const [Receipt, setReceipt] = useState('');
  const dispatch = useDispatch();
  console.log('user id==========>', user?.id);
  // toggle the switch
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // onLogout function call here
  const _onLogout = async () => {
    await AsyncStorage.removeItem('userDetail').then(() => {
      resetRoot('AuthStackScreen');
    });
  };
  // Delete api call here
  const DeleteAccount = async () => {
    let data = {
      action: 'delete_account',
      user_id: user?.id,
    };

    dispatch(
      DeleteMethod(data, async () => {
        _onLogout();
      }),
    );
  };

  useEffect(() => {
    checkstatus();
  }, []);

  let purchaseUpdateSubscription = null;

  let purchaseErrorSubscription = null;

  const itemSubs = Platform.select({
    // ios: ['com.boilerroomtrades.app.YearlySub'],
    ios: ['com.boilerroomtrades.app.monthlysub'],
  });

  useEffect(() => {
    {
      Platform.OS === 'ios' && initilizeIAPConnection();
    }
  }, []);

  const initilizeIAPConnection = async () => {
    await RNIap.initConnection()
      .then(async connection => {
        setBuyIsLoading(true);

        console.log('IAP result', connection);

        await getItems();
      })
      .catch(err => {
        console.warn(`IAP ERROR ${err.code}`, err.message);
      });
  };

  const getItems = async () => {
    try {
      console.log('itemSubs ', itemSubs);
      const subcription = await RNIap.getSubscriptions(itemSubs);
      setBuyIsLoading(false);

      console.log('get Subcription ==============>', subcription);

      setProducts([...subcription]);
      // console.log("product price=====>",Products[0].localizedPrice)

      if (Products.length !== 0) {
        if (Platform.OS === 'ios') {
          // your logic here to save the products in states etc
          // Make sure to check the response differently for android and ios as it is different for both
        }
      }
    } catch (err) {
      console.log('IAP error', err);
      setBuyIsLoading(false);

      setError('errorr', err.message);
    }
  };

  useEffect(async () => {
    if (Platform.OS === 'ios') {
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
  const restorePurchases = async () => {
    try {
      const purchase = Products[Products.length - 1];
      console.info('Available purchases :: ', purchase);
      if (Products && Products.length > 0) {
        console.log({
          availableItemsMessage: `Got ${Products.length} items.`,
          receipt: Products[0].transactionReceipt,
        });
        await requestSubscription(Products[0]?.productId);

        // Alert.alert('Purchases Avaiable to Restore');
      } else {
        Alert.alert('No Purchases Avaiable to Restore');
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  };
  const requestSubscription = async sku => {
    setBuyIsLoading(true);

    console.log('IAP req', sku);

    try {
      await RNIap.requestPurchase(sku)
        // await RNIap.requestSubscription(sku)

        .then(async result => {
          console.log('IAP req sub=========>', result);
          if (Platform.OS === 'ios') {
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

            setReceipt(result?.transactionReceipt);
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
  const uploadReceipt = async () => {
    let data = {
      action: 'user_iap',
      price: Products[0]?.localizedPrice,
      plan: Products[0]?.subscriptionPeriodUnitIOS,
      user_id: user?.id,
      receipt: Receipt,
    };
    console.log('daata========>', data);
    // alert(JSON.stringify(data));
    dispatch(
      UploadReceipt(data, res => {
        setBuyIsLoading;
        {
          false;
        }
      }),
    );
    dispatch(
      UserDetailMethod(
        data,
        () => {
          setBuyIsLoading;
          {
            false;
          }
          resetRoot('TabStackScreen');
        },
        () => { },
      ),
    );
  };
  const checkstatus = async () => {
    if (user?.role === "administrator") {
      setStatus('true');
    }
    else {
      if (
        user?.user_current_membership === '' &&
        !user?.user_subscription_status &&
        !user?.iap_active
      ) {
        setStatus('');
      } else {
        setStatus('true');
      }
    }

  };

  // delete modal content define here
  const DeactivateModalContent = () => {
    return (
      <View style={styless.modalContentWrapper}>
        <Text style={styless.wantText}>{labels.Delete}</Text>
        <Text style={styless.areYouText}>{labels.areyouDeactive}</Text>
        <View style={styless.btnWrapper}>
          <CustomButtonComponent
            onPress={() => {
              setOpenDeacativate(false);
            }}
            text={labels.no}
            bg={colors.cancelBtnColor}
            width={width / 2.8}
            height={50}
            imageShow={false}
            color={colors.black}
          />
          <CustomButtonComponent
            onPress={() => {
              setOpenDeacativate(false);
              setTimeout(() => {
                DeleteAccount();
              }, 500);
            }}
            text={labels.yesp}
            bg={colors.red}
            width={width / 2.8}
            height={50}
            imageShow={false}
          />
        </View>
      </View>
    );
  };
  // delete modal content define here
  const logoutModalContent = () => {
    return (
      <View style={styless.modalContentWrapper}>
        <Text style={styless.wantText}>{labels.logout}</Text>
        <Text style={styless.areYouText}>{labels.areYouLogout}</Text>
        <View style={styless.btnWrapper}>
          <CustomButtonComponent
            onPress={() => {
              setOpen(false);
            }}
            text={labels.no}
            bg={colors.cancelBtnColor}
            width={width / 2.8}
            height={50}
            imageShow={false}
            color={colors.black}
          />
          <CustomButtonComponent
            onPress={() => {
              setOpen(false);
              setTimeout(() => {
                _onLogout();
              }, 500);
            }}
            text={labels.yes}
            bg={colors.red}
            width={width / 2.8}
            height={50}
            imageShow={false}
          />
        </View>
      </View>
    );
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
      <Spinner
        visible={buyIsLoading}
        textContent={labels.loading}
        textStyle={[styles.color(colors.white)]}
      />
      <View style={styles.height(40)} />
      <HeaderTwoComponent
        text={labels.settings}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <SettingComponent
        onPress={() => {
          navigation.navigate('MainStackScreen', {
            screen: 'ChangePassword',
          });
        }}
        toggleSwitch={toggleSwitch}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isToggleShow={false}
        text={labels.changPassword}
        active={0.5}
      />

      <SettingComponent
        onPress={() => { }}
        toggleSwitch={toggleSwitch}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isToggleShow={false}
        text={labels.subscription}
        isSubs={true}
        active={1}
        checkSubscription={status}
      />
      {Platform.OS === 'ios' && (
        <>
          <SettingComponent
            onPress={() => {
              !user?.iap_active
                ? restorePurchases()
                : Alert.alert('Sorry already have this subcription');
            }}
            toggleSwitch={toggleSwitch}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            isToggleShow={false}
            text={labels.restore}
            active={0.5}
          />

        </>
      )}
      <SettingComponent
        onPress={() =>
          Linking.openURL('https://saiyanstocks.com/disclaimer/')
        }
        toggleSwitch={toggleSwitch}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isToggleShow={false}
        text={labels.termsAndCondition}
        active={0.5}
      />
      <SettingComponent
        onPress={() => {
          Linking.openURL(
            'http://saiyanstocks.com/wp-content/uploads/2023/04/SaiyanStocks_eula.pdf',
          );
        }}
        toggleSwitch={toggleSwitch}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isToggleShow={false}
        text={labels.endUser}
        active={0.5}
      />
      <SettingComponent
        onPress={() => {
          setOpenDeacativate(true);
        }}
        toggleSwitch={toggleSwitch}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isToggleShow={false}
        text={labels.Delete}
        active={0.5}
      />
      <SettingComponent
        onPress={() => {
          setOpen(true);
        }}
        toggleSwitch={toggleSwitch}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isToggleShow={false}
        text={labels.logout}
        bw={0}
        active={0.5}
      />
      <CustomModalComponent
        open={openDeacativate}
        setOpen={() => {
          setOpenDeacativate(false);
        }}
        childern={DeactivateModalContent()}
      />
      <CustomModalComponent
        open={open}
        setOpen={() => {
          setOpen(false);
        }}
        childern={logoutModalContent()}
      />
    </ImageBackground>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsTitle: {
    marginLeft: 30,
    marginTop: 20,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
    fontSize: 16,
    marginBottom: 10,
  },
  modalContentWrapper: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: width / 1.2,
    minHeight: 185,
    alignItems: 'center',
    paddingVertical: 10,
  },
  wantText: {
    color: colors.black,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 20,
    marginTop: 15,
  },
  areYouText: {
    color: colors.paragColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center',
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
  },
});

export default SettingScreen;
