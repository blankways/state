import type { StateFamily, WatcherFamily, Watcher, WatcherData, GlobalWatcher } from '@/types/state.types.js'

export type RuntimeState = {
    readonly stateFamily: StateFamily
    readonly watcherFamily: WatcherFamily

    readonly stateValues: Array<unknown>
    readonly stateValuesReferences: Array<number>
    readonly stateValueWatchers: Array<number[]>
    readonly stateValuesActivatedHooks: Array<[() => void]>
    readonly stateValuesDectivatedHooks: Array<[() => void]>

    readonly stateWatchers: Array<Watcher>
    readonly stateGlobalWatchers: Array<GlobalWatcher>
    readonly stateWatchersData: Array<WatcherData>
    readonly stateWatcherIsSingle: Array<boolean>
    readonly stateWatcherIsGlobal: Array<boolean>

    readonly stateValuesDenseIndexLookup: Array<number>
    readonly stateWatchersDenseIndexLookup: Array<number>
    readonly stateGlobalWatchersDenseIndexLookup: Array<number>
}