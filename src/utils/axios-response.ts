import { EAxiosResponse } from '@/type'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { createError, normalizeConfig } from './axios-error'
const HTTP_UNAUTHORIZED_CODE = 401
export function createUnauthorizationError(
  config: AxiosRequestConfig = {},
  request: XMLHttpRequest | undefined = undefined,
  message: string = '当前用户未认证'
) {
  const finalConfig = normalizeConfig(config)
  const response: AxiosResponse = {
    data: null,
    status: HTTP_UNAUTHORIZED_CODE,
    statusText: '',
    headers: {},
    config: finalConfig,
    request,
  }

  return createError(message, finalConfig, undefined, undefined, response)
}

/**
 * 是否是 401 响应
 * @param res 响应
 * @returns {boolean}
 */
export function isUnauthorizedResponse(res?: EAxiosResponse) {
  return res && res.status === HTTP_UNAUTHORIZED_CODE
}
