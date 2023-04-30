import _APi from '../../config/apiConfig';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeStack, navigate} from '../../config/NavigationService';
import {CHANNEL_LIST, LOGIN} from '../actionTypes';

// Channel list api action here
export const GetChannelListMethod = (
  data,
  successCallBack,
  failureCallBack,
) => {
  return async dispatch => {
    console.log('data', data);
    await _APi._post(
      data,
      success => {
        console.log('success of channel list api', success);
        dispatch({
          type: CHANNEL_LIST,
          payload: success?.data?.data,
        });
        successCallBack();
      },
      () => {
        failureCallBack();
      },
    );
  };
};

// change channel notifcations status method here
export const ChangeChannelNotificationStatusMethod = (
  data,
  successCallBack,
  failureCallBack,
) => {
  return async dispatch => {
    await _APi._post(
      data,
      success => {
        console.log('success of channel notify change api', success);

        successCallBack(success?.data?.data);
      },
      () => {
        failureCallBack();
      },
    );
  };
};

// get channel notifcations status method here
export const GetChannelNotificationStatusMethod = (
  data,
  successCallBack,
  failureCallBack,
) => {
  return async dispatch => {
    await _APi._post(
      data,
      success => {
        // console.log('success of channel notify get api', success);
        successCallBack(success?.data?.data);
      },
      () => {
        failureCallBack();
      },
    );
  };
};

// send message notification action here
export const SendMessageNotificationMethod = (
  data,
  successCallBack,
  failureCallBack,
) => {
  return async dispatch => {
    await _APi._post(
      data,
      success => {
        console.log('success of send  message notify api', success);
        successCallBack();
      },
      () => {
        failureCallBack();
      },
    );
  };
};
