import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export type BusinessCode = string | number
export type BusinessCodes = BusinessCode[]

interface InterceptorResolveHandler {
  (config: EAxiosRequestConfig):
    | EAxiosRequestConfig
    | Promise<EAxiosRequestConfig>
}
interface InterceptorRejectHandler {
  (error: EAxiosError): any | Promise<never>
}
type InterceptorHandlers = Array<
  | [InterceptorResolveHandler | undefined, InterceptorRejectHandler]
  | [InterceptorResolveHandler]
>

export interface EAAlias {
  code?: string
  message?: string
  data?: string
}

export interface EAExtraInterceptors {
  request: InterceptorHandlers
  response: InterceptorHandlers
}

export interface EAConfig {
  /**成功的业务代码 */
  validBusinessCodes: BusinessCodes
  /**拦截器 */
  interceptors?: EAExtraInterceptors
  /**业务数据与业务代码的别名 */
  businessAlias?: EAAlias
  /**用户未认证的业务代码 */
  unanthorizedBusinessCodes?: BusinessCodes
  /**执行成功信息的函数，一般是UI组件的函数 */
  success?: (msg: string) => any
  /**执行失败信息的函数，一般是UI组件的函数 */
  warning?: (msg: string) => any
  _feedback?: boolean | string | [string]
}

export interface EAxiosRequestConfig extends AxiosRequestConfig {
  /**
   * 是否在成功时弹出接口返回的 message （可传字符串，覆盖接口返回的信息），需要注册 success 函数
   * 可传入一个字符串元组，表示可选，如果接口无返回则使用，如：{ _feedback: ['这是备用的成功信息'] }
   */
  _feedback?: boolean | string | [string]
  /**
   * 禁止弹出接口返回的 message 及配置的 _feedback
   */
  _silent?: boolean
}

export interface EAxiosBusinessResult {
  code: number | string
  message: string
  data: any
}

export type EAxiosResponse = AxiosResponse & {
  config?: EAxiosRequestConfig
  /**由原响应数据经 EAConfig['businessAlias'] 转换的业务数据 */
  _business?: EAxiosBusinessResult
}

export type EAxiosError = AxiosError & {
  response?: EAxiosResponse
  /**可输出由原响应错误转换的默认报错信息 */
  _formatMessage?: () => string
}
