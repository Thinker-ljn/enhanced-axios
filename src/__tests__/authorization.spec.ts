import { parseAliasResult } from '@/alias'
import {
  genIfUnauthorizedInterceptor,
  injectAuthorizationCheck,
} from '@/authorization'
import { EAxiosError, EAxiosResponse } from '@/type'
import { createError } from '@/utils/axios-error'
import { createUnauthorizationError } from '@/utils/axios-response'
import { createTestConfig } from '../__test-utils__/helpers'

describe('authorization interceptors', () => {
  const gRes = (data: any = null): EAxiosResponse => ({
    data,
    status: 500,
    statusText: '',
    headers: {},
    config: createTestConfig(),
    _business: parseAliasResult(data),
  })

  const gErr = (msg: string, data: any = null) => {
    const res = gRes(data)
    return createError(msg, res.config, undefined, undefined, res)
  }

  const { resolve, reject } = injectAuthorizationCheck({
    validBusinessCodes: [],
    unanthorizedBusinessCodes: [401401],
  })

  const { resolve: resolveWithUnauthorizedBusinessCodes } =
    injectAuthorizationCheck({
      validBusinessCodes: [],
      unauthorizedBusinessCodes: [401402],
    })

  const { resolve: resolveWithBothUnauthorizedOptions } =
    injectAuthorizationCheck({
      validBusinessCodes: [],
      unauthorizedBusinessCodes: [401403],
      unanthorizedBusinessCodes: [401404],
    })

  it('should return custom 401Error property', async () => {
    const res = resolve(gRes({ code: 401401, message: '未认证呀...' })) as any

    await res.catch((e: EAxiosError) => {
      expect(e.response?.status).toBe(401)
      expect(e.message).toBe('未认证呀...')
    })
  })

  it('should return custom 401Error property with unauthorizedBusinessCodes', async () => {
    const res = resolveWithUnauthorizedBusinessCodes(
      gRes({ code: 401402, message: '未认证呀...' })
    ) as any

    await res.catch((e: EAxiosError) => {
      expect(e.response?.status).toBe(401)
      expect(e.message).toBe('未认证呀...')
    })
  })

  it('should prefer unauthorizedBusinessCodes over legacy option', () => {
    const input = gRes({ code: 401404, message: '旧配置未认证码' })
    const res = resolveWithBothUnauthorizedOptions(input) as any
    expect(res).toBe(input)
  })

  it('should return origin input when business success', () => {
    const input = gRes({ code: 200, message: '成功' })
    const res = resolve(input) as any
    expect(res).toBe(input)
  })

  it('should return origin input when pass normal http error', async () => {
    const err401 = createUnauthorizationError({})
    expect(err401.config?.headers).toBeDefined()
    expect(err401.response?.config.headers).toBeDefined()
    await reject(err401).catch((e) => {
      expect(e).toBe(err401)
    })

    const normalErr = gErr('')
    await reject(normalErr).catch((e) => {
      expect(e).toBe(normalErr)
    })
  })

  it('should return custom 401Error property when pass business unauthorization', async () => {
    const res = gRes({ code: 401401, message: '未认证呀..' })
    const err = createError('', res.config, undefined, undefined, res)
    const resErr = reject(err) as any

    await resErr.catch((e: EAxiosError) => {
      expect(e.response?.status).toBe(401)
      expect(e.message).toBe('未认证呀..')
    })
  })

  it('should allow sync unauthorized callback', () => {
    const err401 = createUnauthorizationError({})
    const interceptor = genIfUnauthorizedInterceptor(() => 'redirect-login')

    expect(interceptor(err401)).toBe('redirect-login')
  })
})
