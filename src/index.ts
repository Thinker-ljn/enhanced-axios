import { genIfUnauthorizedInterceptor } from './authorization'
import { EA_BUSINESS_ERROR_CODE } from './business'
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

export { enhancedAxios, genIfUnauthorizedInterceptor, EA_BUSINESS_ERROR_CODE }

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
