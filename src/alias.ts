import {
  EAAlias,
  EAConfig,
  EAxiosBusinessResult,
  EAxiosError,
  EAxiosResponse,
} from '@/type'
import { Axios } from 'axios'

export const defaultAlias = {
  code: 'code',
  message: 'message',
  data: 'data',
}

export const parseAliasResult = (
  resData: any,
  alias: EAAlias = {}
): EAxiosBusinessResult => {
  if (!resData || typeof resData !== 'object') {
    return resData
  }
  const { code, message, data } = { ...defaultAlias, ...alias }
  return {
    code: resData[code],
    message: resData[message],
    data: resData[data],
  }
}

export const injectAliasInterceptor = (eaConfig: EAConfig, axios?: Axios) => {
  const resolve = (response?: EAxiosResponse) => {
    if (response) {
      response._business = parseAliasResult(
        response.data,
        eaConfig.businessAlias
      )
    }

    return response
  }

  const reject = (error: EAxiosError) => {
    error.response = resolve(error.response)
    error._formatMessage = () => {
      if (!error.response) return ''
      const { status, statusText } = error.response
      const aliasData = error.response._business || ({} as EAxiosBusinessResult)
      const defaultMsg = `[${aliasData.code || status}]: ${
        aliasData.message || statusText || '网络异常~请稍候再试'
      }`

      return defaultMsg
    }
    return Promise.reject(error)
  }

  if (axios) {
    axios.interceptors.response.use(resolve, reject)
  }

  return {
    resolve,
    reject,
  }
}
