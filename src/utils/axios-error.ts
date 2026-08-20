import { EAxiosBusinessResult, EAxiosError, EAxiosRequestConfig } from '@/type'
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
export function createError(
  message: string,
  config: EAxiosRequestConfig | InternalAxiosRequestConfig = {},
  code?: string,
  request?: XMLHttpRequest,
  response?: AxiosResponse
): EAxiosError {
  const error = new AxiosError(
    message,
    code,
    config as InternalAxiosRequestConfig,
    request,
    response
  ) as EAxiosError
  addFormatMessage(error)
  return error
}

function parseCodeMsg(error: EAxiosError) {
  if (!error.response) return ''
  const { status, statusText } = error.response
  const aliasData = error.response._business || ({} as EAxiosBusinessResult)
  return {
    code: aliasData.code ?? status,
    msg:
      aliasData.message || statusText || error.message || '网络异常~请稍候再试',
  }
}

export function addFormatMessage(error: EAxiosError) {
  error._formatCodeMessage = () => {
    const res = parseCodeMsg(error)
    if (!res) return ''
    const { code, msg } = res
    const defaultMsg = `[${code}]: ${msg}`

    return defaultMsg
  }
  error._formatMessage = () => {
    const res = parseCodeMsg(error)
    if (!res) return ''
    return res.msg
  }
}
