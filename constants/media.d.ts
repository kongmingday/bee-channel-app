import { PageParams } from '.';
import { UserAndRelationship, UserInfo } from './auth';
import { FavoriteType } from './enum';

export type Category = {
	id: string;
	name: string;
};

export type SimpleMedia = {
	id: string;
	authorId: string;
	title: string;
	introduction: string;
	tag: string;
	categoryId: number;
	coverPath: string;
	savePath: string;
	likeCount: number;
	unlikeCount: number;
	publicTime: string;
	sawTime: string;
	clickedCount: string;
	author: UserAndRelationship;
	commentCount?: number;
	favoriteType?: number; // 0-unliked 1-liked undefined-no react
};

export type Video = SimpleMedia & {
	saveId?: string;
	coverId?: string;
	status?: number;
	upTime?: string;
};

export type MeidaSource = {
	src: string;
	type: string;
};

export type MediaOptions = {
	sources: MeidaSource[];
	title: string;
};

export type Comment = {
	id: string;
	deriveId: string;
	userFromId: string;
	userToId: string;
	fromUser: UserInfo;
	toUser: UserInfo;
	createTime: string;
	content: string;
	childrenCount: number;
	children?: Comment[];
	likeCount: number;
	unlikeCount: number;
	favoriteType?: number;
};

export type ChildrenComment = {
	isLoading: boolean;
	data: Comment[];
};

export type ChildrenPlugin = {
	[key: string]: ChildrenComment;
};

export type ChildrenOpenTree = {
	[key: string]: boolean;
};

export type FavoriteParam = {
	sourceId: string;
	deriveType: number;
	favoriteType: FavoriteType;
	userToId?: string;
};

export type CommitParam = {
	deriveId: string;
	deriveType: DeriveType;
	content: string;
	userToId?: string;
	parentId?: strinng;
};

export type Supervise = {
	id: string;
	reason: string;
	status: AuditStatusType;
	superviseTime: string;
};

export type AuditVideo = {
	id: string;
	coverPath: string;
	introduction: string;
	publicTime: string;
	savePath: string;
	supervise: Supervise;
	title: string;
	upTime: string;
	categoryId: number;
};

export type FileUploadResult = {
	fileId?: string;
	filePath?: string;
};

export type AddHistory = {
	videoId?: string;
	duration?: string;
	pausePoint?: string;
};

export type HistoryVideo = {
	id: string;
	videoId: string;
	duration: string;
	pausePoint: string;
	updateTime: string;
	video: Video;
};

export type PlayList = {
	id: string;
	createTime: string;
	createUser: string;
	name: string;
	status: number;
};

export type PlayVideoList = {
	id: string;
	createTime: string;
	playListId: string;
	videoId: string;
};
