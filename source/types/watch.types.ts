import type { Family, Identifier } from '@blankways/identity'
import type { StateId, ExtractStateValue } from './shared.types.js'

export type WatcherFamily = Family<'@blankways/state(watcher)'>
export type WatcherId = Identifier<WatcherFamily>

export type WatcherSingle<T> = (id: StateId<T>, current: T, previous: T) => void

export type WatcherMultiple<T extends readonly StateId<unknown>[]> = (
    ids: T,
    currents: { [K in keyof T]: ExtractStateValue<T[K]> },
    previouses: { [K in keyof T]: ExtractStateValue<T[K]> },
    updatedIdx: number
) => void

export type Watcher<T extends StateId<unknown> | readonly StateId<unknown>[] = StateId<unknown> | StateId<unknown>[]> = 
    T extends readonly StateId<unknown>[] 
        ? WatcherMultiple<T>
        : T extends StateId<infer U>
        ? WatcherSingle<U>
        : never

export type GlobalWatcher = (id: StateId<unknown>, current: unknown, previous: unknown) => void

export type WatcherData = [ StateId<unknown>[], unknown[], unknown[], number[] ]