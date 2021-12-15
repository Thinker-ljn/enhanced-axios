import { EAxiosResponse } from '@/type'
import { createError } from '@/utils/axios-error'
import { injectAliasInterceptor, parseAliasResult } from '../alias'

describe('parseAliasResult should return origin value', () => {
  it('when pass not a object value', () => {
    expect(parseAliasResult(undefined)).toBeUndefined()
    expect(parseAliasResult(1)).toBe(1)
    expect(parseAliasResult('result')).toBe('result')
  })
})

describe('parseAliasResult should return business value', () => {
  it('when pass a object value', () => {
    expect(parseAliasResult({})).toMatchObject({
      code: undefined,
      message: undefined,
      data: undefined,
    })

    expect(
      parseAliasResult({
        code: 1,
        message: '123',
        data: {},
      })
    ).toMatchObject({
      code: 1,
      message: '123',
      data: {},
    })

    expect(
      parseAliasResult(
        {
          flag: 1,
          msg: '123',
          result: {},
        },
        { code: 'flag', message: 'msg', data: 'result' }
      )
    ).toMatchObject({
      code: 1,
      message: '123',
      data: {},
    })
  })
})

describe('alias interceptors', () => {
  const gRes = (data: any = null): EAxiosResponse => ({
    data,
    status: 400,
    statusText: '',
    headers: {},
    config: {},
  })

  const gErr = (msg: string, data: any = null) => {
    const res = gRes(data)
    return createError(msg, res.config, undefined, undefined, res)
  }

  const { resolve, reject } = injectAliasInterceptor({
    validBusinessCodes: [],
  })

  it('should has _business property', () => {
    expect(resolve(gRes({}))).toHaveProperty('_business')
  })

  it('should has _formatMessage property and return correct', async () => {
    await reject(gErr('')).catch((e) => {
      expect(e).toHaveProperty('_formatMessage')
      expect(e._formatMessage()).toBe('[400]: 网络异常~请稍候再试')
    })

    await reject(gErr('', { message: 'abcde', code: 123 })).catch((e) => {
      expect(e._formatMessage()).toBe('[123]: abcde')
    })
  })
})
