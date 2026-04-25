import { hasInjectionContext, inject, type InjectionKey } from 'vue'

export function mustInject<T>(key: string | InjectionKey<T>, defaultValue?: T): T {
  if (!hasInjectionContext()) {
    throw new Error('This function can only be called in a Vue setup function/script')
  }

  const value = inject(key, defaultValue)
  if (value == undefined) {
    throw new Error(`Injection failed for key ${typeof key === 'string' ? key : key.description}.`)
  }

  return value
}
