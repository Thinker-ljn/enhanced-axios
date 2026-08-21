import { EAxiosResponse } from '@/type'
import { createError } from '@/utils/axios-error'
import { injectAliasInterceptor, parseAliasResult } from '../alias'
import { createTestConfig } from '../__test-utils__/helpers'

describe('parseAliasResult should normalize non-object value', () => {
  it('when pass not a object value', () => {
    const emptyBusinessResult = {
      code: undefined,
      message: undefined,
      data: undefined,
    }

    expect(parseAliasResult(undefined)).toMatchObject(emptyBusinessResult)
    expect(parseAliasResult(1)).toMatchObject(emptyBusinessResult)
    expect(parseAliasResult('result')).toMatchObject(emptyBusinessResult)
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

  it('should pick first defined fallback alias value', () => {
    expect(
      parseAliasResult(
        {
          code: 0,
          msg: 'success',
          data: ['fallback data'],
        },
        { message: ['message', 'msg'], data: ['result', 'data'] }
      )
    ).toMatchObject({
      code: 0,
      message: 'success',
      data: ['fallback data'],
    })

    expect(
      parseAliasResult(
        {
          code: 0,
          message: 'success',
          msg: 'fallback message',
          result: ['result data'],
          data: ['fallback data'],
        },
        { message: ['message', 'msg'], data: ['result', 'data'] }
      )
    ).toMatchObject({
      code: 0,
      message: 'success',
      data: ['result data'],
    })
  })
})

describe('alias interceptors', () => {
  const gRes = (data: any = null): EAxiosResponse => ({
    data,
    status: 400,
    statusText: '',
    headers: {},
    config: createTestConfig(),
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
      expect(e).toHaveProperty('_formatCodeMessage')
      expect(e._formatCodeMessage()).toBe('[400]: 网络异常~请稍候再试')
      expect(e._formatMessage()).toBe('网络异常~请稍候再试')
    })

    await reject(gErr('', { message: 'abcde', code: 123 })).catch((e) => {
      expect(e._formatCodeMessage()).toBe('[123]: abcde')
      expect(e._formatMessage()).toBe('abcde')
    })

    await reject(gErr('', { message: 'abcde', code: 0 })).catch((e) => {
      expect(e._formatCodeMessage()).toBe('[0]: abcde')
      expect(e._formatMessage()).toBe('abcde')
    })
  })
})
