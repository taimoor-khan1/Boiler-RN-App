import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  View,
  Dimensions,
  Text,
} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import {BottomNavBarSection} from '../../assets/labels/localData';
import styles from '../../assets/styles';

const {width} = Dimensions.get('window');

const CustomTabComponent = props => {
  // declare states here
  const {state, navigation} = props;
  const TabIndex = state?.index;

  // On Press action
  const onPressAction = {
    Tips: item => {
      navigation.navigate(item.routeName);
    },
    News: item => {
      navigation.navigate(item.routeName);
    },
  };

  // when select botton tab item here
  const nonSelectd = (item, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressAction[item.routeName](item)}
        style={[
          styless.ButtonContainer(
            TabIndex === index ? colors.theme_Color : 'transparent',
            TabIndex === index && index === 0 ? 15 : 0,
            TabIndex === index && TabIndex === 1 ? 15 : 0,
          ),
        ]}>
        <View>
          {[
            TabIndex === index ? (
              <View style={styless.tabIconWrapper}>
                <Image source={item.selectedIcon} />
                <Text
                  style={styless.tabText(
                    TabIndex === index ? colors.white : colors.black,
                  )}>
                  {item?.title}
                </Text>
              </View>
            ) : (
              <View style={styless.tabIconWrapper}>
                <Image source={item.unselectedIcon} />
                <Text
                  style={styless.tabText(
                    TabIndex === index ? colors.white : colors.black,
                  )}>
                  {item?.title}
                </Text>
              </View>
            ),
          ]}
        </View>
      </TouchableOpacity>
    );
  };

  // render method here
  return (
    <>
      <View style={[styless.bottomTab, styless.shadowbb]}>
        {BottomNavBarSection?.map((item, index) => nonSelectd(item, index))}
      </View>
    </>
  );
};

const styless = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  ButtonContainer: (bg, brTL, brTR) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bg,
    width: width / 2,

    ...ifIphoneX(
      {
        height: Platform.OS === 'ios' ? 70 : 50,
        paddingBottom: Platform.OS === 'android' ? 0 : 10,
      },
      {
        height: Platform.OS === 'ios' ? 55 : 50,
      },
    ),
    borderTopLeftRadius: brTL,
    borderTopRightRadius: brTR,
  }),
  bottomTab: {
    backgroundColor: colors.white,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    ...ifIphoneX(
      {
        height: Platform.OS === 'ios' ? 70 : 50,
      },
      {
        height: Platform.OS === 'ios' ? 55 : 50,
      },
    ),
  },
  Bottom_Icon_Buttom: {
    width: 24,
    height: 24,
  },
  bottomTabText: {
    color: colors.theme_Color,
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  shadowbb: {
    shadowColor: 'gray',
    shadowOffset: {width: 0.8, height: 1.5},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  tabWrapper: {
    backgroundColor: colors.theme_Color,
  },
  tabIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: col => ({
    color: col,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    marginLeft: 10,
  }),
});
export default CustomTabComponent;
