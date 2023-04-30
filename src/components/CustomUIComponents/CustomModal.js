import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import styles from '../../assets/styles';

const {width, height} = Dimensions.get('window');
export const CustomModalComponent = ({open, setOpen, childern}) => {
  return (
    <ReactNativeModal
      backdropOpacity={0.8}
      scrollHorizontal={true}
      style={{margin: 0}}
      onModalHide={() => setOpen(false)}
      isVisible={open}
      deviceWidth={width}
      animationIn="fadeIn"
      onBackButtonPress={() => {
        setOpen(false);
      }}>
      <View
        style={[
          styles.flex(1),
          styles.justifyContent('center'),
          styles.alignItems('center'),
        ]}>
        {childern}
      </View>
    </ReactNativeModal>
  );
};
