import { Axios } from 'axios'
import { EAConfig, EAxiosRequestConfig, EAxiosResponse } from './type'
import { createError } from './utils/axios-error'

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

export function injectBusinessResultParser(eaConfig: EAConfig, axios?: Axios) {
  const parser = (response: EAxiosResponse) => {
    const { _business } = response

    const responseData = response.data
    const config = response.config

    const { code, message, data } = _business || {}
    // 处理业务逻辑
    if (code !== undefined && message !== undefined) {
      const validCodes = eaConfig.validBusinessCodes || []
      if (!validCodes.includes(code)) {
        const axiosError = createError(
          message || '业务请求有误，数据解析失败',
          response.config,
          'BUSINESS_ERROR',
          undefined,
          response
        )
        return Promise.reject(axiosError)
      } else {
        const feedback = config._feedback || eaConfig._feedback
        if (feedback && !config._silent) {
          const finalMsg = parseFeedback(message, feedback)
          if (typeof finalMsg === 'string' && eaConfig.success) {
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
