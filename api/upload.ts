import { formDataPost, get, post } from "@/utils/common/fetchUtil";
import qs from 'qs'

const serviceName = process.env.NEXT_PUBLIC_MEDIA_SERVICE

export const uploadSingleFile = (file: FormData) => {
  return formDataPost(`/${serviceName}/file/upload/single`, file)
}

export const checkChunk = (fileHash: string, chunkIndex: number) => {
  return get(
    `/${serviceName}/file/chunk/check`,
    { fileHash, chunkIndex }
  )
}

export const checkFile = (fileHash: string, extension: string) => {
  return get(
    `/${serviceName}/file/check`,
    { fileHash, extension }
  )
}


export const uploadChunk = (chunk: FormData) => {
  return formDataPost(`/${serviceName}/file/upload/chunk`, chunk)
}

export const mergeChunk = (fileHash: string, chunkCount: number) => {
  return post(`/${serviceName}/file/upload/chunk/merge`, { fileHash, chunkCount })
}