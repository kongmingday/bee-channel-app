import { post } from '@/utils/common/fetchUtil'

const serviceName = process.env.EXPO_PUBLIC_CHECKCODE_SERVICE

export const sendCodeToEmail = (email: string) => {
  return post(`/${serviceName}/sendCode`, null, { param: email })
}

export const verify = (key: string, code: string) => {
  return post(`/${serviceName}/verify`, null, { key, code })
}
