import { Axios, AxiosRequestConfig } from 'axios'
import {
  EAxiosBusinessResult,
  EAxiosResponse,
  EAxiosError,
  EAConfig,
} from './type'
import {
  createUnauthorizationError,
  isUnauthorizedResponse,
} from './utils/axios-response'
import { noneResolve } from './utils/none-func'

export function injectAuthorizationCheck(eaConfig: EAConfig, axios?: Axios) {
  const invalidCode = (business?: EAxiosBusinessResult) =>
    business &&
    (eaConfig.unanthorizedBusinessCodes || []).includes(business.code)

  const resolve = (res: EAxiosResponse) => {
    const { _business } = res
    if (invalidCode(_business)) {
      return Promise.reject(
        createUnauthorizationError(res.config, undefined, _business?.message)
      )
    }
    return res
  }

  const reject = (error: EAxiosError) => {
    const { _business } = error.response || {}
    if (isUnauthorizedResponse(error.response) || !invalidCode(_business)) {
      return Promise.reject(error)
    }

    // 业务代码判断为未认证，则包装一个 401 响应
    return Promise.reject(
      createUnauthorizationError(
        error.config,
        undefined,
        _business?.message || error.message
      )
    )
  }
  if (axios) {
    axios.interceptors.response.use(resolve)
    axios.interceptors.response.use(noneResolve, reject)
  }

  return {
    resolve,
    reject,
  }
}

export function genIfUnauthorizedInterceptor(
  callback: (config: AxiosRequestConfig) => Promise<any>
) {
  return function ifUnauthorizedInterceptor(e: EAxiosError) {
    if (isUnauthorizedResponse(e.response)) {
      return callback(e.config)
    }
    return Promise.reject(e)
  }
}
