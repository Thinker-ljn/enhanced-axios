import {
  EAAlias,
  EAConfig,
  EAxiosBusinessResult,
  EAxiosError,
  EAxiosInstance,
  EAxiosResponse,
} from '@/type'
import { AxiosInstance } from 'axios'
import { addFormatMessage } from './utils/axios-error'

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

export const injectAliasInterceptor = (
  eaConfig: EAConfig,
  axios?: AxiosInstance | EAxiosInstance
) => {
  const resolve = (response: EAxiosResponse) => {
    response._business = parseAliasResult(response.data, eaConfig.businessAlias)
    return response
  }

  const reject = (error: EAxiosError) => {
    if (error.response) {
      error.response = resolve(error.response)
    }
    addFormatMessage(error)
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
