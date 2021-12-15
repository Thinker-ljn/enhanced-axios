import { Axios } from 'axios'
import { EAConfig, EAxiosError } from './type'
import { noneResolve } from './utils/none-func'
import { isSilent } from './utils/silent'

const ECONNABORTED = 'ECONNABORTED'

function isAxiosError(error: EAxiosError) {
  return error.isAxiosError
}

export function injectFinalErrorHandler(eaConfig: EAConfig, axios?: Axios) {
  const warning = (msg: string) => {
    if (eaConfig.warning) {
      eaConfig.warning(msg)
    }
  }
  const errorHandler = (error: EAxiosError) => {
    if (!isAxiosError(error)) {
      warning(error.message)
      return Promise.reject(error)
    }

    if (error.code === ECONNABORTED) {
      warning('请求超时，请稍后再试。')
    }

    if (error._formatMessage) {
      if (!isSilent(error.config)) {
        const message = error._formatMessage()
        warning(message)
      }
    }
    return Promise.reject(error)
  }
  if (axios) {
    axios.interceptors.response.use(noneResolve, errorHandler)
  }
  return {
    resolve: noneResolve,
    reject: errorHandler,
  }
}
