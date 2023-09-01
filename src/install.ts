import { Axios, AxiosInstance } from 'axios'
import { injectAliasInterceptor } from './alias'
import { injectAuthorizationCheck } from './authorization'
import { injectBusinessResultParser } from './business'
import { injectFinalErrorHandler } from './final-error'
import { EAConfig, EAExtraInterceptors, EAxiosInstance } from './type'
import { getKeys } from './utils/keyof'
import { noneReject, noneResolve } from './utils/none-func'

const enhancedAxios = <T extends Axios | AxiosInstance | EAxiosInstance>(
  axios: T,
  config: EAConfig
): T => {
  function runInterceptors(interceptors: EAExtraInterceptors) {
    const keys = getKeys(interceptors)
    keys.forEach((key) => {
      const innerInterceptors = interceptors[key]
      if (innerInterceptors.length && ['request', 'response'].includes(key)) {
        innerInterceptors.forEach((icpts) => {
          const [resolve = noneResolve, reject = noneReject] = icpts || []
          axios.interceptors[key].use(resolve, reject)
        })
      }
    })
  }
  if (config.frontInterceptors) {
    runInterceptors(config.frontInterceptors)
  }

  injectAliasInterceptor(config, axios)
  injectAuthorizationCheck(config, axios)
  injectBusinessResultParser(config, axios)

  if (config.middleInterceptors) {
    runInterceptors(config.middleInterceptors)
  }

  injectFinalErrorHandler(config, axios)

  if (config.interceptors) {
    runInterceptors(config.interceptors)
  }

  return axios
}

export { enhancedAxios }
