import { EAxiosError } from '@/type'

export const noneResolve = <T>(value: T): T => value
export const noneReject = (error: EAxiosError) => error
