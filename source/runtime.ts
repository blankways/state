import { Identity } from '@blankways/identity'
import type { RuntimeState, GlobalWatcher, Watcher, WatcherData, WatcherId } from '@/types/index.js'

// State shared by API functions for the lifetime of this module.
export const runtime: RuntimeState = {
    stateFamily: Identity.Family.create<'@blankways/state(state)'>(),
    watcherFamily: Identity.Family.create<'@blankways/state(watcher)'>(),

    stateValues: new Array<unknown>(),
    stateValuesReferences: new Array<number>(),
    stateValueWatchers: new Array<number[]>(),
    stateValuesActivatedHooks: new Array<[() => void]>(),
    stateValuesDectivatedHooks: new Array<[() => void]>(),

    stateGlobalWatchers: new Array<GlobalWatcher>(),
    stateWatchers: new Array<Watcher>(),
    stateWatchersData: new Array<WatcherData>(),
    stateWatcherIsSingle: new Array<boolean>(),
    stateWatcherIsGlobal: new Array<boolean>(),

    stateValuesDenseIndexLookup: new Array<number>(),
    stateWatchersDenseIndexLookup: new Array<number>(),
    stateGlobalWatchersDenseIndexLookup: new Array<number>(),

    computeWatchers: new Array<WatcherId>()
}