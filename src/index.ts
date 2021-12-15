import { genIfUnauthorizedInterceptor } from './authorization'
import { enhancedAxios } from './install'
import type {
  EAExtraInterceptors,
  EAAlias,
  EAConfig,
  EAxiosBusinessResult,
  EAxiosError,
  EAxiosRequestConfig,
  EAxiosResponse,
} from './type'

export { enhancedAxios, genIfUnauthorizedInterceptor }

export {
  EAExtraInterceptors,
  EAAlias,
  EAConfig,
  EAxiosError,
  EAxiosResponse,
  EAxiosBusinessResult,
  EAxiosRequestConfig,
}
