import { AxiosInstance } from 'axios'
import {
  EAConfig,
  EAxiosInstance,
  EAxiosRequestConfig,
  EAxiosResponse,
} from './type'
import { createError } from './utils/axios-error'

export const EA_BUSINESS_ERROR_CODE = 'BUSINESS_ERROR'

// 如果 feedback 是一个字符串元组，代表可选，如果接口没有返回 msg，则使用 feedback
export function parseFeedback(
  apiMsg?: string,
  feedback?: EAxiosRequestConfig['_feedback']
) {
  if (typeof feedback === 'string') {
    return feedback
  }

  const isOption = Array.isArray(feedback)
  return isOption ? apiMsg || feedback[0] : apiMsg
}

export function injectBusinessResultParser(
  eaConfig: EAConfig,
  axios?: AxiosInstance | EAxiosInstance
) {
  const parser = (response: EAxiosResponse) => {
    const business = response._business || {}

    const responseData = response.data
    const config = response.config

    const { code, message, data } = business
    const shouldHandleBusinessResponse =
      eaConfig.shouldHandleBusinessResponse ||
      ((_: any, result: typeof business) => result.code !== undefined)

    // 处理业务逻辑
    if (shouldHandleBusinessResponse(responseData, business, response)) {
      const validCodes = eaConfig.validBusinessCodes || []
      if (code === undefined || !validCodes.includes(code)) {
        const axiosError = createError(
          message || '业务请求有误，数据解析失败',
          response.config,
          EA_BUSINESS_ERROR_CODE,
          undefined,
          response
        )
        return Promise.reject(axiosError)
      } else {
        const feedback = config._feedback || eaConfig._feedback
        if (feedback && !config._silent) {
          const finalMsg = parseFeedback(message, feedback)
          if (finalMsg && typeof finalMsg === 'string' && eaConfig.success) {
            eaConfig.success(finalMsg)
          }
        }
        // 返回响应数据或者真正的业务数据
        return eaConfig.returnBusinessData === false ? responseData : data
      }
    } else {
      return responseData
    }
  }
  if (axios) {
    axios.interceptors.response.use(parser)
  }

  return {
    resolve: parser,
    reject: undefined,
  }
}
