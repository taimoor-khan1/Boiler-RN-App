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
  Alert,
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
import { get_channels, login, signUp, user_iap } from '../../config/apiActions';
import { validateEmail } from '../../config/Utility';
import { LoginApiMethod, SignUpApiMethod } from '../../store/actions/AuthAction';
import { GetChannelListMethod } from '../../store/actions/ChannelAction';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import database from '@react-native-firebase/database';
import { resetRoot } from '../../config/NavigationService';
import { getFCMToken } from '../../config/fcmToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from "react-native-elements"

const SignUpScreen = ({ navigation }) => {
  // States Declares here
  const { width } = Dimensions.get('window');
  const [secureText, setSecureText] = useState(true);
  const [check, setcheck] = useState(true);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [fieldError2, setFieldError2] = useState(false);
  const [fieldError3, setFieldError3] = useState(false);
  const [fieldError4, setFieldError4] = useState(false);
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
  const submitSignUPDetail = () => {
    if (
      fieldError ||
      (fieldError2 && !email?.length) ||
      !password?.length ||
      !firstName?.length ||
      !lastName?.length
    ) {
      Toast.show(labels.plzAllFieldsAreRequired);
    } else if (!check) {
      Alert.alert("Kindly Accept terms and condition")
      // navigation.navigate('TabStackScreen');
    } else {

      userSignUpDetail();
    }
  };

  // SignUp api call here
  const userSignUpDetail = () => {
    setLoader(true);
    let data = {
      action: 'register',
      user_email: email,
      user_password: password,
      first_name: firstName,
      last_name: lastName,
      token: userToken,
    };
    AsyncStorage.setItem('userToken', userToken);
    // alert(JSON.stringify(data));
    dispatch(
      SignUpApiMethod(
        data,
        async apiData => {
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
        (res) => {

          setLoader(false);
        },
      ),
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
          <LoginTopComponent title={labels.welcome} desc={labels.SignUpDec} />
          <View style={styles.height(22)} />
          <CustomInputComponent
            placeholder={labels.UserFirstName}
            mb={!firstName?.length && fieldError ? 0 : 15}
            value={firstName}
            onChange={e => {
              if (e !== '') {
                setFirstName(e);
                setFieldError(false);
                setEmailError(false);
              } else {
                setFieldError(true);
                setFirstName(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            error={!firstName?.length && fieldError}
            errorMessage={showErrorMessage}
            Width={width / 1.2}
          />
          <CustomInputComponent
            placeholder={labels.UserLastName}
            mb={!lastName?.length && fieldError2 ? 0 : 15}
            value={lastName}
            onChange={e => {
              if (e !== '') {
                setLastName(e);
                setFieldError2(false);
                setEmailError(false);
              } else {
                setFieldError2(true);
                setLastName(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            error={!lastName?.length && fieldError2}
            errorMessage={showErrorMessage}
            Width={width / 1.2}
          />
          <CustomInputComponent
            placeholder={labels.emailAddress}
            mb={fieldError3 || emailError ? 0 : 15}
            value={email}
            keyboardType={"email-address"}

            onChange={e => {
              if (e !== '') {
                setEmail(e);
                setFieldError3(false);
                setEmailError(false);
              } else {
                setFieldError3(true);
                setEmail(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            onBlur={() => {
              if (email?.length) {
                checkEmail();
              }
            }}
            error={(!email?.length && fieldError3) || emailError}
            errorMessage={showErrorMessage}
            Width={width / 1.2}
          />
          <CustomInputComponent
            placeholder={labels.password}
            imageShow={true}
            mb={!password?.length && fieldError4 ? 0 : 10}
            onPress={() => {
              setSecureText(!secureText);
            }}
            secureTextEntry={secureText}
            value={password}
            onChange={e => {
              if (e !== '') {
                setPassword(e);
                setFieldError4(false);
              } else {
                setFieldError4(true);
                setPassword(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            error={!password?.length && fieldError4}
            errorMessage={showErrorMessage}
            Width={width / 1.2}
          />

          <View style={[styless.mt30,]}>
            <CheckBox
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={check}
              onPress={() => setcheck(!check)}
              checkedColor={colors.theme_Color}
            />
            <Text style={[styless.bottomText(0, colors.paragColor), { marginRight: 20, textAlign: "center" }]}>
              {labels.bySigning}

              <Text
                style={styless.bottomText(5, colors.theme_Color)}
                onPress={() =>
                  Linking.openURL('https://saiyanstocks.com/disclaimer/')
                }
              >
                {labels.termsAndCondition}
              </Text>
              <Text style={styless.bottomText(5, colors.paragColor)}>
                {labels.and}
              </Text>
              <Text
                style={styless.bottomText(5, colors.theme_Color)}
                onPress={() => {
                  Linking.openURL(
                    'http://saiyanstocks.com/wp-content/uploads/2023/04/SaiyanStocks_eula.pdf',
                  );
                }}>
                {labels.endUser}
              </Text>
            </Text>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login")
              }}
              
              >
              <Text style={styless.bottomText(5, colors.theme_Color)}>
                {labels.termsAndCondition}
              </Text>
            </TouchableOpacity> */}
          </View>

          <CustomButtonComponent
            onPress={() => {
              submitSignUPDetail();
            }}
            text={labels.signup}
            bg={colors.theme_Color}
            width={width / 1.2}
            height={54}
          />
          <View style={styless.mt31}>
            <Text style={styless.bottomText(0, colors.paragColor)}>
              {labels.alreadyMember}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styless.bottomText(5, colors.theme_Color)}>
                {labels.login}
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
    // alignItems: 'center',ْ
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 50
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
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    marginHorizontal: 30,
    // alignContent:"center",
    marginBottom: 15

  },
  mt31: {
    marginTop: 20,
    flexDirection: 'row',
  },
  bottomText: (mL, color) => ({
    marginLeft: mL,
    color: color,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
  }),
});
export default SignUpScreen;
