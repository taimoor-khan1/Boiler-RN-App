import React, {useState} from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import colors from '../../assets/colors';

export const CustomSwitchComponent = ({
  isEnabled,
  setIsEnabled,
  toggleSwitch,
}) => {
  return (
    <Switch
      trackColor={{false: '#D6D6D6', true: colors.theme_Color}}
      thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
      ios_backgroundColor="#D6D6D6"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
