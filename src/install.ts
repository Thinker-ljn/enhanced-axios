import { AxiosInstance } from 'axios'
import { injectAliasInterceptor } from './alias'
import { injectAuthorizationCheck } from './authorization'
import { injectBusinessResultParser } from './business'
import { injectFinalErrorHandler } from './final-error'
import { EAConfig, EAExtraInterceptors, EAxiosInstance } from './type'
import { noneReject, noneResolve } from './utils/none-func'

const enhancedAxios = <T extends AxiosInstance | EAxiosInstance>(
  axios: T,
  config: EAConfig
): T => {
  function runInterceptors(interceptors: EAExtraInterceptors) {
    interceptors.request.forEach((icpts) => {
      const [resolve = noneResolve, reject = noneReject] = icpts || []
      axios.interceptors.request.use(resolve, reject)
    })

    interceptors.response.forEach((icpts) => {
      const [resolve = noneResolve, reject = noneReject] = icpts || []
      axios.interceptors.response.use(resolve, reject)
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
