import numberal from 'numeral';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FavoriteType } from '@/.expo/types/enum';

export const isEmail = (value: string) => {
  const regex = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  return regex.test(value);
};

export const convertNumber = (value?: string) => {
  return value ? numberal(value).format('0a') : 0;
};

export const calculateDuration = (targetTime?: string) => {
  if (!targetTime) {
    return 'just now';
  }
  dayjs.extend(relativeTime);
  return dayjs(targetTime).fromNow();
};

export const dateFormat = (targetTime: string | Date, template?: string) => {
  return dayjs(targetTime).format(template || 'YYYY-MM-DD');
};

export const favoriteDataPackaging = (
  target: any,
  favoriteType: FavoriteType,
) => {
  const sourceIsUndefined = target.favoriteType === undefined;
  const targetIsLike = favoriteType === FavoriteType.LIKE;
  const sourceIsLike = target.favoriteType === FavoriteType.LIKE;
  if (targetIsLike) {
    target.favoriteType = sourceIsLike ? undefined : FavoriteType.LIKE;
    target.likeCount = sourceIsLike
      ? target?.likeCount! - 1
      : target?.likeCount! + 1;
  } else {
    target.favoriteType = sourceIsLike ? FavoriteType.UNLIKE : undefined;
    target.likeCount = sourceIsLike
      ? target?.likeCount! - 1
      : target?.likeCount!;
  }
  if (sourceIsUndefined) {
    target.favoriteType = favoriteType;
  }
  return target;
};
