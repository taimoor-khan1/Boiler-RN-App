import React, { useEffect, useState } from 'react';
import {
  Text,
  ImageBackground,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import styles from '../../assets/styles';
import { CustomButtonComponent } from '../../components/CustomUIComponents/CustomButton';
import { CustomInputComponent } from '../../components/CustomUIComponents/CustomInput';
import { LoginTopComponent } from '../../components/CustomUIComponents/LoginTopComponent';
import { StatusBarComponent } from '../../components/StatusBar/CustomStatusBar';
import { get_channels, login } from '../../config/apiActions';
import { validateEmail } from '../../config/Utility';
import { LoginApiMethod } from '../../store/actions/AuthAction';
import { GetChannelListMethod } from '../../store/actions/ChannelAction';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import database from '@react-native-firebase/database';
import { resetRoot } from '../../config/NavigationService';
import { getFCMToken } from '../../config/fcmToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  // States Declares here
  const { width } = Dimensions.get('window');
  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState(__DEV__ ? "waqas@o16-labs.com" : "");
  const [password, setPassword] = useState(__DEV__ ? "Abcd!234#Abcd!234" : "");
  // const [email, setEmail] = useState(__DEV__ ? "testhardy@yopmail.com" : "");
  // const [password, setPassword] = useState(__DEV__ ? "Shahmoiz1-" : "");
  const [emailError, setEmailError] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [fieldError2, setFieldError2] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');
  const dispatch = useDispatch();
  const { channelList } = useSelector(state => state?.Channel);
  const [loader, setLoader] = useState(false);
  const [userToken, setUserToken] = useState(null);

  // getChannels here
  useEffect(() => {
    getChannels();
    getFCMToken(dispatch, token => {
      let splitToken = token?.split(':');
      setUserToken(splitToken[0]);
    });
  }, []);

  // get channel method define here
  const getChannels = () => {
    let action = get_channels;
    dispatch(
      GetChannelListMethod(
        { action },
        () => { },
        () => { },
      ),
    );
  };

  //check email is valid or not here
  const checkEmail = () => {
    if (validateEmail(email) === true) {
      setEmailError(false);
    } else {
      setEmailError(true);
      setShowErrorMessage(labels.emailIsInvalid);
    }
  };

  // submit login detail here
  const submitLoginDetail = () => {
    if (fieldError || (fieldError2 && !email?.length) || !password?.length) {
      Toast.show(labels.plzAllFieldsAreRequired);
    } else {
      // navigation.navigate('TabStackScreen');
      userLoginDetail();
    }
  };

  // login api call here
  const userLoginDetail = () => {
    setLoader(true);
    let data = {
      action: login,
      user_login: email,
      user_password: password,
      token: userToken,
    };
    AsyncStorage.setItem('userToken', userToken);
    // alert(JSON.stringify(data));
    dispatch(
      LoginApiMethod(
        data,
        async apiData => {

          console.log("log=========>", apiData);
          setLoader(false);
          database()
            .ref(`users/${apiData?.id}`)
            .once('value', snapShot => {
              if (snapShot.val() === null) {
                database().ref(`users/${apiData?.id}/`).set({
                  name: apiData?.name,
                  role: apiData?.role,
                  user_id: apiData?.id,
                });
                channelList?.map((item, index) => {
                  database()
                    .ref(
                      `channels/${item?.type}/${item?.channel_id}/members/${apiData?.id}/`,
                    )
                    .set({
                      name: apiData?.name,
                      notification_status: 1,
                      role: apiData?.role,
                      un_read_count: 0,
                      user_id: apiData?.id,
                      last_message: '',
                    });
                  resetRoot('TabStackScreen');
                });
              } else {
                resetRoot('TabStackScreen');
              }
            });
        },
        () => {

          setLoader(false);
        },
      )
    )
  };

  // render method here
  return (
    <ImageBackground source={assets.bgImage} style={styless.container}>
      <StatusBarComponent
        bgColor={'transparent'}
        barStyle={labels.darkContent}
      />
      <Spinner
        visible={loader}
        textContent={labels.loading}
        textStyle={[styles.color(colors.white)]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styless.container}>
        <ScrollView
          contentContainerStyle={styless.scrollContainer}
          showsVerticalScrollIndicator={false}
          style={styles.flexGrow(1)}>
          <View style={styles.height(100)} />
          <LoginTopComponent title={labels.welcome} desc={labels.loginDec} />
          <View style={styles.height(22)} />
          <CustomInputComponent
            placeholder={labels.emailAddress}
            mb={fieldError || emailError ? 0 : 15}
            value={email}
            onChange={e => {
              if (e !== '') {
                setEmail(e);
                setFieldError(false);
                setEmailError(false);
              } else {
                setFieldError(true);
                setEmail(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            onBlur={() => {
              if (email?.length) {
                checkEmail();
              }
            }}
            keyboardType={"email-address"}

            error={(!email?.length && fieldError) || emailError}
            errorMessage={showErrorMessage}
            Width={width / 1.2}
          />
          <CustomInputComponent
            placeholder={labels.password}
            imageShow={true}
            mb={!password?.length && fieldError2 ? 0 : 10}
            onPress={() => {
              setSecureText(!secureText);
            }}
            secureTextEntry={secureText}
            value={password}
            onChange={e => {
              if (e !== '') {
                setPassword(e);
                setFieldError2(false);
              } else {
                setFieldError2(true);
                setPassword(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            error={!password?.length && fieldError2}
            errorMessage={showErrorMessage}
            Width={width / 1.2}
          />
          <View style={styless.forgotWrapper}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://saiyanstocks.com/my-account/lost-password/',
                );
              }}>
              <Text style={styless.forgotText}>{labels.forgotPassword}</Text>
            </TouchableOpacity>
          </View>
          <CustomButtonComponent
            onPress={() => {
              submitLoginDetail();
            }}
            text={labels.login}
            bg={colors.theme_Color}
            width={width / 1.2}
            height={54}
          />
          <View style={styless.mt30}>
            <Text style={styless.bottomText(0, colors.paragColor)}>
              {labels.notAMember}
            </Text>
            <TouchableOpacity
              onPress={() => {

                {
                  Platform.OS === "ios" ?
                    navigation.navigate("SignUp") :
                    Linking.openURL(
                      'https://saiyanstocks.com/memberships/',
                    );
                }
              }}


            >
              <Text style={styless.bottomText(5, colors.theme_Color)}>
                {labels.registerNow}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styless = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    paddingRight: 10,
    marginTop: 5,
    marginBottom: 30,
  },
  forgotText: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.paragColor,
    fontSize: 16,
  },
  mt30: {
    marginTop: 41,
    flexDirection: 'row',
  },
  bottomText: (mL, color) => ({
    marginLeft: mL,
    color: color,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
  }),
});
export default LoginScreen;
