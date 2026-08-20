import axios from 'axios'
import type { EAxiosInstance, EAxiosRequestConfig } from '@/type'

interface MyData {
  id: string
}

function assertEnhancedInstanceTypes(service: EAxiosInstance) {
  const getResult: Promise<MyData> = service.get<MyData>('/api')
  const postResult: Promise<MyData> = service.post<MyData>('/api', {
    name: 'test',
  })
  const requestResult: Promise<MyData> = service.request<MyData>({
    url: '/api',
  })
  const callableUrlResult: Promise<MyData> = service<MyData>('/api')
  const config: EAxiosRequestConfig = { url: '/api' }
  const callableConfigResult: Promise<MyData> = service<MyData>(config)

  void getResult
  void postResult
  void requestResult
  void callableUrlResult
  void callableConfigResult
}

describe('enhanced axios instance types', () => {
  it('should type enhanced methods as business data by default', () => {
    const service = axios.create() as EAxiosInstance

    expect(assertEnhancedInstanceTypes).toBeDefined()
    expect(typeof service.get).toBe('function')
  })
})
