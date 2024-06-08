export type LicenseResult = {
	superviseLicense?: SuperviseLicense;
	live?: Live;
};

export type SuperviseLicense = {
	id: string;
	userId: string;
	reason: string;
	supervisorId: strring;
	createTime: string;
	superviseTime: string;
	status: number;
};

export type LiveInfo = {
	id?: string;
	liveId: string;
	title: string;
	introduction: string;
	coverPath: string;
};

export type Live = {
	id: string;
	userId: string;
	liveKey: string;
	liveSecret: string;
	status: number;
	currentStatus: number;
	creditScore: number;
};

export type LiveMessage = {
	userId: string;
	profile: string;
	username: string;
	message: string;
	system: boolean;
	roomId: string;
	amount: number;
};

export type ActiveLiveInfo = {
	id: string;
	title: string;
	cover: string;
	userId: string;
	profile: string;
	username: string;
};
