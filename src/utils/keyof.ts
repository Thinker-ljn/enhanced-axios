import { EAExtraInterceptors } from '@/type'

type GetKeyFn<T extends EAExtraInterceptors> = (obj: T) => (keyof T)[]
export function getKeys<T extends EAExtraInterceptors>(obj: T) {
  return (Object.keys as GetKeyFn<T>)(obj)
}
