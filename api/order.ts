import { PageParams, SearchParams } from "@/types";
import { CommitParam, FavoriteParam } from "@/types/media";
import { PayRecordParam } from "@/types/order";
import { del, get, post } from "@/utils/common/fetchUtil";

const serviceName = process.env.NEXT_PUBLIC_ORDER_SERVICE

export const getQrcCode = (data: PayRecordParam) => {
  return post(`/${serviceName}/qrc/generate`, data)
}
