import { PayType } from "./enum";

export type PayRecordParam = {
  totalPrice: number;
  payType: PayType;
  deriveId: string;
  message: string | null;
  userId: string;
};
