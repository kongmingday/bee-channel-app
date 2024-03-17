import { post } from '@/utils/common/fetchUtil'

const serviceName = process.env.EXPO_PUBLIC_AUTH_SERVICE
const clientId = process.env.EXPO_PUBLIC_CLIENT_ID
const secret = process.env.EXPO_PUBLIC_SECRET
const grantType = process.env.EXPO_PUBLIC_GRANT_TYPE

export const login = (params: any) => {
  params = {
    client_id: clientId,
    client_secret: secret,
    grant_type: grantType,
    username: JSON.stringify(params)
  }
  return post(`/${serviceName}/oauth/token`, null, params)
}

export const enable = (params: any) => {
  return post(`/${serviceName}/enable`, null, params)
}

export const signUp = (data: any) => {
  return post(`/${serviceName}/signUp`, data)
}
