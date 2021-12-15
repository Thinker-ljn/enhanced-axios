import { parseAliasResult } from '@/alias'
import { injectBusinessResultParser, parseFeedback } from '@/business'
import { EAxiosError, EAxiosResponse } from '@/type'

describe('business interceptors parseFeedback', () => {
  it('should use apiMsg when feedbackMsg is empty', () => {
    expect(parseFeedback('apiMsg')).toBe('apiMsg')
  })

  it('should use feedbackMsg when feedbackMsg is pass', () => {
    expect(parseFeedback('apiMsg', 'feedbackMsg')).toBe('feedbackMsg')
  })

  it('should use option feedback', () => {
    expect(parseFeedback('', ['feedbackMsg'])).toBe('feedbackMsg')
  })

  it('should use apiMsg', () => {
    expect(parseFeedback('apiMsg', ['feedbackMsg'])).toBe('apiMsg')
  })
})

describe('business interceptors parser', () => {
  const success = jest.fn()
  const { resolve } = injectBusinessResultParser({
    validBusinessCodes: [0],
    success,
    _feedback: true,
  })

  const gRes = (data: any = null): EAxiosResponse => ({
    data,
    status: 200,
    statusText: '',
    headers: {},
    config: {},
    _business: parseAliasResult(data),
  })

  it('should return axios error', async () => {
    const resError = gRes({ code: 1, message: 'error' })
    const output = resolve(resError) as any

    await output.catch((e: EAxiosError) => {
      expect(e.isAxiosError).toBe(true)
      expect(e.message).toBe('error')
    })
  })

  it('should return business data', () => {
    const res = gRes({ code: 0, message: 'success', data: { a: 'a' } })
    const output = resolve(res) as any
    expect(output).toMatchObject({ a: 'a' })
    expect(success).toHaveBeenCalled()
  })

  it('should return business data', () => {
    const res = gRes({ flag: 0, msg: 'success' })
    const output = resolve(res) as any
    expect(output).toMatchObject({ flag: 0, msg: 'success' })
  })
})
