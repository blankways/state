import type { StateFamily } from '@/types/shared.types.js'
import type { WatcherFamily, Watcher, WatcherData, GlobalWatcher, WatcherId } from '@/types/watch.types.js'

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

    readonly computeWatchers: Array<WatcherId>
}