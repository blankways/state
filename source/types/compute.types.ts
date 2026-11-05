import type { Family, Identifier } from '@blankways/identity'
import type { StateId } from './shared.types.js'

export type ComputeFamily = Family<'@blankways/state(watcher)'>
export type ComputeId = Identifier<ComputeFamily>

export type StatesValues<States extends readonly StateId<unknown>[] | StateId<unknown>> = 
  States extends readonly StateId<unknown>[]
    ? { [Key in keyof States]: States[Key] extends StateId<infer T> ? T : never }
    : States extends StateId<infer T>
      ? T
      : never

export type ComputeFn<States extends readonly StateId<unknown>[] | StateId<unknown>, Type> = (
  currentValues: StatesValues<States>, 
  previousValues: StatesValues<States>, 
  changedIdx: number
) => Type