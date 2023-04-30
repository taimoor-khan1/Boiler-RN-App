import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {
  Button,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../assets/colors';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import styles from '../../assets/styles';
import {CustomButtonComponent} from '../../components/CustomUIComponents/CustomButton';
import {CustomInputComponent} from '../../components/CustomUIComponents/CustomInput';
import {HeaderTwoComponent} from '../../components/HeaderComponents/Header2';
import {StatusBarComponent} from '../../components/StatusBar/CustomStatusBar';
import {useSelector, useDispatch} from 'react-redux';
import {ChangePasswordMethod} from '../../store/actions/AuthAction';
import {change_password} from '../../config/apiActions';
import {navigate} from '../../config/NavigationService';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';

const {width} = Dimensions.get('window');

const ChangePasswordScreen = ({navigation}) => {
  //Declare all states here
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchError, setMatchError] = useState(false);
  const [fieldError1, setFieldError1] = useState(false);
  const [fieldError2, setFieldError2] = useState(false);
  const [fieldError3, setFieldError3] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');
  const [showMatchErrorMessage, setShowMatchErrorMessage] = useState('');
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);
  const [secureText3, setSecureText3] = useState(true);
  const [loader, setLoader] = useState(false);
  const {user} = useSelector(state => state?.Auth);
  const [newPasswordMiniLength, setnewPasswordMiniLength] = useState(false);
  const [confirmPasswordMiniLength, setConfirmPasswordMiniLength] =
    useState(false);

  const dispatch = useDispatch();

  // checking password in hook function
  useEffect(() => {
    if (newPassword?.length && confirmPassword?.length) {
      checkMatchPasswordMethod();
    }
  }, [newPassword, confirmPassword]);

  // match password check here
  const checkMatchPasswordMethod = () => {
    if (newPassword === confirmPassword) {
      setMatchError(false);
    } else {
      setMatchError(true);
      setFieldError2(false);
      setFieldError3(false);
      setShowMatchErrorMessage(labels.passwordIsNotMatch);
    }
  };

  // submit password changes here
  const submitPasswordChanges = () => {
    if (
      oldPassword?.length &&
      newPassword?.length &&
      confirmPassword?.length &&
      !fieldError1 &&
      !fieldError2 &&
      !fieldError3 &&
      !matchError &&
      !newPasswordMiniLength &&
      !confirmPasswordMiniLength
    ) {
      setLoader(true);
      let data = {
        action: change_password,
        user_login: user?.email,
        user_password: oldPassword,
        new_password: newPassword,
      };
      dispatch(
        ChangePasswordMethod(
          data,
          () => {
            setLoader(false);
            navigate('Setting');
          },
          () => {
            setLoader(false);
          },
        ),
      );
    } else {
      Toast.show(labels.fieldsError);
    }
  };

  //render method here
  return (
    <>
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
        <View style={styles.height(40)} />
        <HeaderTwoComponent
          text={labels.changPassword}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.height(30)} />
        <ScrollView
          contentContainerStyle={styless.scrollContainer}
          showsVerticalScrollIndicator={false}
          style={styles.flexGrow(1)}>
          <CustomInputComponent
            placeholder={labels.oldPassword}
            imageShow={true}
            mb={!oldPassword?.length && fieldError1 ? 0 : 10}
            onPress={() => {
              setSecureText1(!secureText1);
            }}
            secureTextEntry={secureText1}
            value={oldPassword}
            onChange={e => {
              if (e !== '') {
                setOldPassword(e);
                setFieldError1(false);
              } else {
                setFieldError1(true);
                setOldPassword(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            error={!oldPassword?.length && fieldError1}
            errorMessage={showErrorMessage}
          />
          <CustomInputComponent
            placeholder={labels.newPassword}
            imageShow={true}
            mb={
              (!newPassword?.length && fieldError2) || newPasswordMiniLength
                ? 0
                : 10
            }
            onPress={() => {
              setSecureText2(!secureText2);
            }}
            secureTextEntry={secureText2}
            value={newPassword}
            onBlur={() => {
              if (newPassword?.length) {
                if (newPassword?.length < 8) {
                  setnewPasswordMiniLength(true);
                  setMatchError(false);
                  setShowErrorMessage(labels.plzPasswordLengthMustBeEight);
                } else {
                  setnewPasswordMiniLength(false);
                }
              }
            }}
            onChange={e => {
              if (e !== '') {
                setNewPassword(e);
                setFieldError2(false);
                setMatchError(false);
              } else {
                setFieldError2(true);
                setMatchError(false);
                setNewPassword(e);
                setShowErrorMessage(labels.plzFieldIsRequired);
              }
            }}
            error={
              (!newPassword?.length && fieldError2) || newPasswordMiniLength
            }
            errorMessage={matchError ? showMatchErrorMessage : showErrorMessage}
          />
          <CustomInputComponent
            placeholder={labels.confirmPassword}
            imageShow={true}
            mb={
              (!confirmPassword?.length && fieldError3) ||
              confirmPasswordMiniLength
                ? 0
                : 10
            }
            onPress={() => {
              setSecureText3(!secureText3);
            }}
            secureTextEntry={secureText3}
            value={confirmPassword}
            onBlur={() => {
              if (confirmPassword?.length) {
                if (confirmPassword?.length < 8) {
                  setConfirmPasswordMiniLength(true);
                  setShowErrorMessage(labels.plzPasswordLengthMustBeEight);
                } else {
                  setConfirmPasswordMiniLength(false);
                }
              }
            }}
            onChange={e => {
              if (newPasswordMiniLength) {
                Toast.show(labels.plzFirstAboveErrorResolved);
              } else {
                if (e !== '') {
                  setConfirmPassword(e);
                  setFieldError3(false);
                  setMatchError(false);
                } else {
                  setFieldError3(true);
                  setConfirmPassword(e);
                  setMatchError(false);
                  setShowErrorMessage(labels.plzFieldIsRequired);
                }
              }
            }}
            error={
              (!confirmPassword?.length && fieldError3) ||
              matchError ||
              confirmPasswordMiniLength
            }
            errorMessage={matchError ? showMatchErrorMessage : showErrorMessage}
          />

          <View style={styles.height(20)} />
          <CustomButtonComponent
            onPress={() => {
              submitPasswordChanges();
            }}
            text={labels.save}
            bg={colors.theme_Color}
            width={width / 1.3}
            height={50}
          />
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;
