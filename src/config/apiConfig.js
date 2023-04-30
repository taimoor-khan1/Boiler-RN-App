import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { navigate } from './NavigationService';

class Api {
  constructor() {
    // this.baseUrl = 'https://boilerroomtrades.com/wp-admin/admin-ajax.php';
    this.baseUrl = 'https://saiyanstocks.com/wp-admin/admin-ajax.php'
  }

  async _post(obj, success, failure) {
    const token = await AsyncStorage.getItem('token');
    // console.log('token', token);
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    try {
      let res = await this.instance.post('', obj);
      // console.log('this.instance', res);
      if (res) {
        success(res);
      }
    } catch (error) {
      console.log('error', error);
      if (error?.response?.status === 401) {
        failure(error?.response?.status);
      }
    }
  }
}

export default new Api();
