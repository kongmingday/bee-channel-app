import { SearchParams } from '@/constants';
import { UploadUserInfo } from '@/constants/auth';
import { get, put, formDataPost } from '@/utils/common/fetchUtil';
import { setUserInfo } from '@/utils/common/tokenUtils';

const serviceName = process.env.EXPO_PUBLIC_USER_SERVICE;

export const getUserInfo = async () => {
	return await get(`/${serviceName}/info`).then(res => {
		if (res.code === 200 && res.result) {
			setUserInfo(res.result);
		}
		return res;
	});
};

export const getUserFullInfo = (userId: string, currentUserId?: string) => {
	return get(`/${serviceName}/info/full/${userId}`, {
		currentId: currentUserId,
	});
};

export const searchUserFullInfoList = (
	data: SearchParams & {
		currentUserId?: string;
	},
) => {
	return get(`/${serviceName}/info/full/page`, data);
};

export const uploadUserInfo = (data: UploadUserInfo) => {
	return put(`/${serviceName}/info`, data);
};

export const subscribeAction = (userToId: string) => {
	return get(`/${serviceName}/info/subscribe/${userToId}`);
};

export const getSubscription = (pageParams: SearchParams) => {
	return get(`/${serviceName}/info/subscription`, { ...pageParams });
};

export const uploadSingleFile = (file: FormData) => {
	return formDataPost(`/${serviceName}/info/upload/avatar`, file);
};
