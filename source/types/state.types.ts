import type { Family, Identifier } from '@blankways/identity'

export type StateFamily = Family<'@blankways/state(state)'>
export type StateId<Type> = Identifier<StateFamily, Type>

export type WatcherFamily = Family<'@blankways/state(watcher)'>
export type WatcherId = Identifier<WatcherFamily>

export type ExtractStateValue<T> = T extends StateId<infer U> ? U : never

export type WatcherSingle<T> = (id: StateId<T>, current: T, previous: T) => void

export type WatcherTuple<T extends readonly StateId<unknown>[]> = (
    ids: T,
    currents: { [K in keyof T]: ExtractStateValue<T[K]> },
    previouses: { [K in keyof T]: ExtractStateValue<T[K]> },
    updatedIdx: number
) => void

type AnyStateId = StateId<unknown> | readonly StateId<unknown>[]
export type Watcher<T extends StateId<unknown> | readonly StateId<unknown>[] = AnyStateId> = 
    T extends readonly StateId<unknown>[] 
        ? WatcherTuple<T>
        : T extends StateId<infer U>
        ? WatcherSingle<U>
        : never

export type GlobalWatcher = (id: StateId<unknown>, current: unknown, previous: unknown) => void

export type WatcherData = [ StateId<unknown>[], unknown[], unknown[], number[] ]

export type StatesValues<States extends readonly StateId<unknown>[]> = {
  [Key in keyof States]: States[Key] extends StateId<infer T> ? T : never
}

export type ComputeFn<States extends readonly StateId<unknown>[], Type> = (
  currentValues: StatesValues<States>, 
  previousValues: StatesValues<States>, 
  changedIdx: number
) => Type