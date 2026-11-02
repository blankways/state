import type { StateFamily, WatcherFamily, Watcher, WatcherData, GlobalWatcher } from '@/types/state.types.js'

export type RuntimeState = {
    readonly stateFamily: StateFamily
    readonly watcherFamily: WatcherFamily

    readonly stateValues: Array<unknown>

    readonly stateWatchers: Array<Watcher>
    readonly stateGlobalWatchers: Array<GlobalWatcher>
    readonly stateWatchersData: Array<WatcherData>
    readonly stateWatcherIsSingle: Array<boolean>
    readonly stateWatcherIsGlobal: Array<boolean>

    readonly stateValuesDenseIndexLookup: Array<number>
    readonly stateWatchersDenseIndexLookup: Array<number>
    readonly stateGlobalWatchersDenseIndexLookup: Array<number>
}