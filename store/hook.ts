import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PageParams } from '@/constants';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type FetchFunctionType<P> = (
	params: PageParams | (PageParams & P),
) => any;

export type FetchDataPageReturn<T, P> = {
	data: T[];
	isLoading: boolean;
	isRefreshing: boolean;
	isNoMore: boolean;
	dataTotal: number;
	otherParams: P | undefined;
	setData: Dispatch<SetStateAction<T[]>>;
	setRefreshState: Dispatch<SetStateAction<boolean>>;
	setPageParams: Dispatch<SetStateAction<PageParams>>;
	setFetchFunction: Dispatch<SetStateAction<FetchFunctionType<P>>>;
	setProcessState: Dispatch<SetStateAction<boolean>>;
	setOtherParams: Dispatch<SetStateAction<P | undefined>>;
	fetchData: () => Promise<any>;
	refreshPage: () => Promise<any>;
};

export const useFetchDataPage = <T, R = any, P = any>(
	fetchFunction: FetchFunctionType<P>,
	enableProcessData?: boolean,
	processData?: (data: T[]) => R[],
	pageSize?: number,
	otherParams?: P,
): FetchDataPageReturn<T, P> => {
	const [data, setData] = useState<T[]>([]);
	const [dataTotal, setTotal] = useState<number>(0);
	const [isLoading, setLoadState] = useState<boolean>(false);
	const [isRefreshing, setRefreshState] = useState<boolean>(false);
	const [enableProcess, setProcessState] = useState<boolean>(
		enableProcessData || false,
	);
	const [params, setParams] = useState<P | undefined>(otherParams);
	const [fetchTemplate, setFetchTemplate] = useState<FetchFunctionType<P>>(
		() => fetchFunction,
	);
	const [isNoMore, setNoMoreState] = useState<boolean>(false);
	const [pageParams, setPageParams] = useState<PageParams>(
		new PageParams(0, pageSize),
	);

	const fetchData = async () => {
		if (isLoading || isRefreshing) {
			return;
		}
		if (isNoMore) {
			return;
		}
		setLoadState(true);

		await fetchTemplate({
			...pageParams,
			pageNo: pageParams.pageNo + 1,
			...params,
		})
			.then((response: any) => {
				let {
					result: { data, total },
				} = response;
				if (enableProcess) {
					data = processData!!(data);
				}
				setData(pre => [...pre, ...data]);
				setTotal(total);
				if ((pageParams.pageNo + 1) * pageParams.pageSize > total) {
					setNoMoreState(true);
				}
				setPageParams(pre => ({ ...pre, pageNo: pre.pageNo + 1 }));
			})
			.finally(() => {
				setLoadState(false);
			});
	};

	const refreshPage = async () => {
		if (isLoading || isRefreshing) {
			return;
		}
		setRefreshState(true);
		setData([]);
		setTotal(0);
		setNoMoreState(false);
		setLoadState(true);
		await fetchTemplate({ ...pageParams, pageNo: 1, ...params })
			.then((response: any) => {
				let {
					result: { data, total },
				} = response;
				if (enableProcess) {
					data = processData!!(data);
				}
				setData(data);
				setTotal(total);
				setPageParams(pre => ({ ...pre, pageNo: 1 }));
				if (pageParams.pageSize > total) {
					setNoMoreState(true);
				}
			})
			.finally(() => {
				setRefreshState(false);
				setLoadState(false);
			});
	};

	useEffect(() => {
		refreshPage();
	}, [fetchTemplate]);

	useEffect(() => {
		refreshPage();
	}, [params]);

	return {
		data,
		isLoading,
		isRefreshing,
		isNoMore,
		dataTotal,
		otherParams: params,
		setData,
		setRefreshState,
		setPageParams,
		setFetchFunction: setFetchTemplate,
		setProcessState,
		setOtherParams: setParams,
		fetchData,
		refreshPage,
	};
};
