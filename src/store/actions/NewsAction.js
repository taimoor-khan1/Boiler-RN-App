import _APi from '../../config/apiConfig';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeStack, navigate} from '../../config/NavigationService';
import {CHANNEL_LIST, LOGIN, NEWS_LIST} from '../actionTypes';
import labels from '../../assets/labels';

// Create News  Action here
export const CreateNewsMethod = (data, successCallBack, failureCallBack) => {
  return async dispatch => {
    console.log('data', data);
    await _APi._post(
      data,
      success => {
        if (success?.data?.status === 'success') {
          console.log('success of create news', success);
          Toast.show(success?.data?.message);
          successCallBack();
        } else {
          Toast.show(success?.data?.message);
          failureCallBack();
        }
      },
      () => {
        failureCallBack();
      },
    );
  };
};

// Edit News  Action here
export const EditNewsMethod = (data, successCallBack, failureCallBack) => {
  return async dispatch => {
    console.log('dataaaa', data);
    await _APi._post(
      data,
      success => {
        console.log('success ssss', success);
        if (success?.status === 200) {
          console.log('success of edit news', success);
          Toast.show('News Edit');
          successCallBack();
        } else {
          Toast.show(success?.message);
          failureCallBack();
        }
      },
      () => {
        failureCallBack();
      },
    );
  };
};

// Get News Action here
export const GetNewsMethod = (data, successCallBack, failureCallBack) => {
  return async dispatch => {
    await _APi._post(
      data,
      success => {
        if (success?.data?.status === 'success') {
          // console.log('success of get news', success);
          dispatch({
            type: NEWS_LIST,
            payload: success?.data?.data,
          });
          successCallBack();
        } else {
          Toast.show(success?.data?.message);
          failureCallBack();
        }
      },
      () => {
        failureCallBack();
      },
    );
  };
};

// Delete News Action here
export const DeleteNewsMethod = (data, successCallBack, failureCallBack) => {
  return async dispatch => {
    await _APi._post(
      data,
      success => {
        if (success?.data?.status === 'success') {
          console.log('success of delete news', success);
          Toast.show(success?.data?.message);
          successCallBack();
        } else {
          Toast.show(success?.data?.message);
          failureCallBack();
        }
      },
      () => {
        failureCallBack();
      },
    );
  };
};
