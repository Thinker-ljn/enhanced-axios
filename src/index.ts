import { genIfUnauthorizedInterceptor } from './authorization'
import { enhancedAxios } from './install'
import type {
  EAExtraInterceptors,
  EAAlias,
  EAConfig,
  EAxiosBusinessResult,
  EAxiosError,
  EAxiosInternalRequestConfig,
  EAxiosRequestConfig,
  EAxiosResponse,
  EAxiosInstance,
} from './type'

export { enhancedAxios, genIfUnauthorizedInterceptor }

export {
  EAExtraInterceptors,
  EAAlias,
  EAConfig,
  EAxiosError,
  EAxiosResponse,
  EAxiosBusinessResult,
  EAxiosInternalRequestConfig,
  EAxiosRequestConfig,
  EAxiosInstance,
}
