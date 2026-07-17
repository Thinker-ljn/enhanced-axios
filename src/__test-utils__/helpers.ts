import { EAxiosInternalRequestConfig } from '@/type'

export function createTestConfig(
  config: Partial<EAxiosInternalRequestConfig> = {}
): EAxiosInternalRequestConfig {
  return {
    headers: {},
    ...config,
  } as EAxiosInternalRequestConfig
}
