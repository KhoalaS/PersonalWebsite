import type { OutputLine } from './Types'
import type { InjectionKey, Ref } from 'vue'

export const shellOutputKey = Symbol() as InjectionKey<Ref<Array<OutputLine>>>
export const shellInputKey = Symbol() as InjectionKey<Ref<string>>
