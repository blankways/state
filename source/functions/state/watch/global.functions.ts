import { runtime } from '@/runtime.js'
import { createWatcherId } from '@/functions/index.js'
import type { WatcherId, GlobalWatcher } from '@/types/index.js'

export function watchGlobalState(callback: GlobalWatcher): WatcherId {
    const id = createWatcherId()
    runtime.stateGlobalWatchersDenseIndexLookup[id] = runtime.stateGlobalWatchers.length
    runtime.stateGlobalWatchers.push(callback)
    return id
}