import { LiveInfo } from "@/types/live";
import { get, post, del, put } from "@/utils/common/fetchUtil";

const serviceName = process.env.NEXT_PUBLIC_LIVE_SERVICE

export const getPersonalLicense = () => {
  return get(`/${serviceName}/process/license`)
}

export const applyLicense = () => {
  return post(`/${serviceName}/process/license`)
}


export const cancelLicense = () => {
  return del(`/${serviceName}/process/license`)
}

export const getPersonalLiveInfo = (liveId: string) => {
  return get(`/${serviceName}/info/personal/${liveId}`)
}

export const updateLiveInfo = (liveInfo: LiveInfo) => {
  return post(`/${serviceName}/info`, liveInfo)
}

export const getLiveUserInfo = (liveKeyId: string) => {
  return get(`/${serviceName}/info/${liveKeyId}`)
}

