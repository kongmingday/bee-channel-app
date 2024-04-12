import { PageParams } from '@/.expo/types';
import { LiveInfo } from '@/.expo/types/live';
import { get, post, del } from '@/utils/common/fetchUtil';

const serviceName = process.env.EXPO_PUBLIC_LIVE_SERVICE;

export const getActiveLivePage = (pageParams: PageParams) => {
	return get(`/${serviceName}/process`, pageParams);
};

export const getPersonalLicense = () => {
	return get(`/${serviceName}/process/license`);
};

export const applyLicense = () => {
	return post(`/${serviceName}/process/license`);
};

export const cancelLicense = () => {
	return del(`/${serviceName}/process/license`);
};

export const getPersonalLiveInfo = (liveId: string) => {
	return get(`/${serviceName}/info/personal/${liveId}`);
};

export const updateLiveInfo = (liveInfo: LiveInfo) => {
	return post(`/${serviceName}/info`, liveInfo);
};

export const getLiveUserInfo = (liveKeyId: string) => {
	return get(`/${serviceName}/info/${liveKeyId}`);
};
