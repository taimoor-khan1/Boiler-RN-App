import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';

export const StatusBarComponent = ({bgColor, barStyle}) => {
  return (
    <StatusBar
      backgroundColor={bgColor}
      barStyle={barStyle}
      translucent={true}
    />
  );
};
