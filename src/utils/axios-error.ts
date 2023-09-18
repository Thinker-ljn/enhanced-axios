// fork from axios
import { EAxiosBusinessResult, EAxiosError, EAxiosRequestConfig } from '@/type'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
function enhanceError(
  e: Error,
  config: AxiosRequestConfig,
  code?: string,
  request?: XMLHttpRequest,
  response?: AxiosResponse
): EAxiosError {
  const error = e as AxiosError
  error.config = config
  if (code) {
    error.code = code
  }

  error.request = request
  error.response = response
  error.isAxiosError = true

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: (this as any).description,
      number: (this as any).number,
      // Mozilla
      fileName: (this as any).fileName,
      lineNumber: (this as any).lineNumber,
      columnNumber: (this as any).columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status:
        this.response && this.response.status ? this.response.status : null,
    }
  }
  addFormatMessage(error)
  return error
}

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
  config: EAxiosRequestConfig,
  code?: string,
  request?: XMLHttpRequest,
  response?: AxiosResponse
): EAxiosError {
  const error = new Error(message)
  return enhanceError(error, config, code, request, response)
}

function parseCodeMsg(error: EAxiosError) {
  if (!error.response) return ''
  const { status, statusText } = error.response
  const aliasData = error.response._business || ({} as EAxiosBusinessResult)
  return {
    code: aliasData.code || status,
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
