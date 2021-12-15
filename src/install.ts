import { Axios } from 'axios'
import { injectAliasInterceptor } from './alias'
import { injectAuthorizationCheck } from './authorization'
import { injectBusinessResultParser } from './business'
import { injectFinalErrorHandler } from './final-error'
import { EAConfig } from './type'
import { getKeys } from './utils/keyof'
import { noneReject, noneResolve } from './utils/none-func'

const enhancedAxios = (axios: Axios, config: EAConfig) => {
  injectAliasInterceptor(config, axios)
  injectAuthorizationCheck(config, axios)
  injectBusinessResultParser(config, axios)
  injectFinalErrorHandler(config, axios)

  const { interceptors } = config
  if (!interceptors) {
    return
  }

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

  return axios
}

export { enhancedAxios }
