import { AuthInfo, JwtPayloadExt } from '@/.expo/types/auth';
import { jwtDecode } from 'jwt-decode';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_INFO = 'AUTH_INFO';
export const AUTH_TOKEN = 'AUTH_TOKEN';
export const USER_INFO = 'USER_INFO';

export const setUserInfo = (value: string) => {
  setItem(USER_INFO, value);
};

export const getUserInfo = () => {
  return getItem(USER_INFO);
};

export const getAuthInfo = () => {
  return getItem(AUTH_INFO);
};

export const setAuthInfo = (value: any) => {
  setItem(AUTH_INFO, value);
};

export const removeAuthToken = () => {
  removeItem(AUTH_TOKEN);
};

export const getAuthToken = () => {
  return getItem(AUTH_TOKEN);
};

export const setAuthToken = (value: any) => {
  setItem(AUTH_TOKEN, `Bearer ${value}`);
};

export const removeItem = (key: string) => {
  AsyncStorage.removeItem(key);
};

export const getItem = (key: string) => {
  const asyncGetItem = async () => {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : '';
  };
  return asyncGetItem();
};

export const setItem = (key: string, value: any) => {
  AsyncStorage.setItem(key, JSON.stringify(value));
};
