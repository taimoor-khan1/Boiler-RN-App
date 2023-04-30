import React, { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from 'react-native-elements';
import assets from '../../assets/images';
import labels from '../../assets/labels';
import { StatusBarComponent } from '../../components/StatusBar/CustomStatusBar';
import { resetRoot } from '../../config/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetailMethod } from '../../store/actions/AuthAction';
import { user_detail } from '../../config/apiActions';
import { useDispatch } from 'react-redux';

const SplashScreen = ({ navigation }) => {
  // Declare states here
  const dispatch = useDispatch();
  //navigate splash to login here
  useEffect(() => {
    checkConditions();
  }, []);

  // check conditions
  const checkConditions = async () => {
    const userDetail = await AsyncStorage.getItem('userDetail');
    if (userDetail === null) {
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } else {
      let data = {
        action: user_detail,
        id: userDetail,
      };
      dispatch(
        UserDetailMethod(
          data,
          () => {
            resetRoot('TabStackScreen');
          },
          () => { },
        ),
      );
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
        <Image source={assets.logo} resizeMode="contain" />
        {/* <Image source={require('../../assets/images/logo.png')} resizeMode="contain" /> */}
        <Image source={assets.lineImage} />
      </ImageBackground>
    </>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
