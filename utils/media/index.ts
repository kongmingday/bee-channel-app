import { FavoriteType } from "@/types/enum"

export const favoriteDataPackaging = (target: any, favoriteType: FavoriteType) => {
  const sourceIsUndefined = target.favoriteType === undefined
  const targetIsLike = favoriteType === FavoriteType.LIKE
  const sourceIsLike = target.favoriteType === FavoriteType.LIKE
  if (targetIsLike) {
    target.favoriteType = sourceIsLike ? undefined : FavoriteType.LIKE
    target.likeCount = sourceIsLike ? target?.likeCount! - 1 : target?.likeCount! + 1
  } else {
    target.favoriteType = sourceIsLike ? FavoriteType.UNLIKE : undefined
    target.likeCount = sourceIsLike ? target?.likeCount! - 1 : target?.likeCount!
  }
  if (sourceIsUndefined) {
    target.favoriteType = favoriteType
  }
  return target;
}