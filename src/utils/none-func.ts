import { EAxiosError, EAxiosRequestConfig } from '@/type'

export const noneResolve = (config: EAxiosRequestConfig) => config
export const noneReject = (error: EAxiosError) => error
