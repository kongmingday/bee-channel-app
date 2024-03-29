import qs from 'qs';
import { getAuthToken, removeAuthToken } from './tokenUtils';

type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE';

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'No Authentication';
  }
}

const baseUrl = process.env.EXPO_PUBLIC_GATEWAY_HOST;

export const get = (url: string, params?: any, headers?: any) => {
  return request(url, 'GET', params, headers);
};

export const post = (url: string, data?: any, params?: any, headers?: any) => {
  return request(`${url}?${qs.stringify(params)}`, 'POST', data, headers);
};

export const put = (url: string, data?: any, params?: any, headers?: any) => {
  return request(`${url}?${qs.stringify(params)}`, 'PUT', data, headers);
};

export const del = (url: string, data?: any, params?: any, headers?: any) => {
  return request(`${url}?${qs.stringify(params)}`, 'DELETE', data, headers);
};

export const request = async (
  url: string,
  method?: HTTP_METHOD,
  data?: any,
  headers?: any,
) => {
  let authToken: string = await getAuthToken();

  const options = {
    method: method || 'GET',
    headers: {
      'Authorization': authToken,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: method === 'GET' ? null : JSON.stringify(data),
  };

  url = `${baseUrl}${url}`;
  if (method === 'GET') {
    url = `${url}?${qs.stringify(data)}`;
  }

  const result = fetch(url, options)
    .then((response) => {
      if (response.status === 401) {
        throw new AuthenticationError(
          'The account is incorrect or the access is expired',
        );
      }
      if (response.status !== 200) {
        throw new Error('Something error');
      }
      return response.json();
    })
    .catch((error) => {
      if (error instanceof SyntaxError) {
        return 'no response data';
      } else if (error instanceof AuthenticationError) {
        removeAuthToken();
      } else {
        console.log(error);
        // Toast('server error, please try again', ToastMode.ERROE)
        return;
      }
    });
  return result;
};
