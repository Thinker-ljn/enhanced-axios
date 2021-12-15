import { EAxiosRequestConfig } from '@/type'

export function isSilent(config: EAxiosRequestConfig) {
  return !!config._silent
}
