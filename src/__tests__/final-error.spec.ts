import { injectFinalErrorHandler } from '@/final-error'
import { createError } from '@/utils/axios-error'

describe('final error interceptors', () => {
  const warning = jest.fn()

  beforeEach(() => {
    warning.mockClear()
  })
  const { reject } = injectFinalErrorHandler({
    validBusinessCodes: [],
    warning,
  })

  it('should return origin error', (done) => {
    const err = new Error('error')
    const res = reject(err as any)
    res.catch((e) => {
      expect(e).toBe(err)
      expect(warning).toHaveBeenCalled()
      done()
    })
  })

  it('should warning timeout', (done) => {
    const err = createError('timeout', {}, 'ECONNABORTED')
    reject(err).catch(() => {
      expect(warning).toHaveBeenCalledWith('请求超时，请稍后再试。')
      done()
    })
  })

  it('should warning error', (done) => {
    const err = createError('timeout', {})
    err._formatMessage = () => '_formatMessage'
    reject(err).catch(() => {
      expect(warning).toHaveBeenCalledWith('_formatMessage')
      done()
    })
  })

  it('should silent', (done) => {
    const err = createError('timeout', { _silent: true })
    err._formatMessage = () => '_formatMessage2'
    reject(err).catch(() => {
      expect(warning).toHaveBeenCalledTimes(0)
      done()
    })
  })
})
