import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import assets from '../../assets/images';
import styles from '../../assets/styles';

const {width} = Dimensions.get('window');
export const CustomInputComponent = ({
  imageShow = false,
  mb = 10,
  placeholder = '',
  onPress,
  secureTextEntry = false,
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
  keyboardType,
  bw = 0,
  borderColor = colors.white,
  showShadow = true,
  Width = width / 1.3,
  multiline = false,
  height = 55,
}) => {
  return (
    <>
      <View
        style={[
          styless.inputWrapper(Width, bw, borderColor),
          styles.mB(mb),
          showShadow && styles.cardShadow,
        ]}>
        <TextInput
          placeholder={placeholder}
          style={styless.inputStyle(Width, height)}
          placeholderTextColor={colors.placeHolderColor}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          multiline={multiline}
          keyboardType={keyboardType}
          
        />
        {imageShow ? (
          <TouchableOpacity onPress={onPress} style={styless.imageStyle}>
            <Image
              source={
                secureTextEntry ? assets.passwordHide : assets.passwordShow
              }
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styless.errorText}>{errorMessage}</Text> : null}
    </>
  );
};

const styless = StyleSheet.create({
  inputStyle: (Width, height) => ({
    width: Width / 1.2,
    color:colors.black,
    minHeight: height,
    paddingLeft: 15,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
  }),
  inputWrapper: Width => ({
    position: 'relative',
    backgroundColor: colors.inputColor,
    width: Width,
    minHeight: 55,
    borderRadius: 10,
  }),
  imageStyle: {
    position: 'absolute',
    right: 12,
    top: 11,
  },
  errorText: {
    color: colors.red,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
});
