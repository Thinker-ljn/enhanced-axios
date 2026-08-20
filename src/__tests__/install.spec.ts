import axios, { AxiosResponse } from 'axios'
import { enhancedAxios } from '@/install'
import { createTestConfig } from '../__test-utils__/helpers'

function getInterceptorHandler<T>(
  handlers: Array<T> | undefined,
  index: number
): T {
  const handler = handlers?.at(index)
  if (!handler) {
    throw new Error('interceptor handler is missing')
  }
  return handler
}

describe('enhancedAxios extra interceptors', () => {
  it('should allow request-only interceptors', () => {
    const instance = axios.create()
    const requestInterceptor = jest.fn((config) => config)

    expect(() => {
      enhancedAxios(instance, {
        validBusinessCodes: [],
        interceptors: {
          request: [[requestInterceptor]],
        },
      })
    }).not.toThrow()

    const handler = getInterceptorHandler(
      instance.interceptors.request.handlers,
      0
    )
    handler.fulfilled?.(createTestConfig())

    expect(requestInterceptor).toHaveBeenCalled()
  })

  it('should allow response-only interceptors', () => {
    const instance = axios.create()
    const responseInterceptor = jest.fn((response) => response)

    expect(() => {
      enhancedAxios(instance, {
        validBusinessCodes: [],
        interceptors: {
          response: [[responseInterceptor]],
        },
      })
    }).not.toThrow()

    const handler = getInterceptorHandler(
      instance.interceptors.response.handlers,
      -1
    )
    handler.fulfilled?.({
      data: {},
      status: 200,
      statusText: '',
      headers: {},
      config: createTestConfig(),
    } as AxiosResponse)

    expect(responseInterceptor).toHaveBeenCalled()
  })
})
