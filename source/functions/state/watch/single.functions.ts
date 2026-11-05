import { runtime } from '@/runtime.js'
import { getState } from '@/functions/index.js'
import { incrementStateReference } from './shared.functions.js'
import type { StateId, WatcherId, Watcher, WatcherData } from '@/types/index.js'

export function watchSingleState(id: WatcherId, stateId: StateId<unknown>, callback: Watcher): WatcherId {
    const denseIndex = runtime.stateWatchers.length
    runtime.stateWatchersDenseIndexLookup[id] = denseIndex
    runtime.stateWatchers.push(callback)
    runtime.stateWatcherIsSingle[denseIndex] = true

    const stateDenseIndex = runtime.stateValuesDenseIndexLookup[stateId]
    const stateValueWatchersArray = runtime.stateValueWatchers[stateDenseIndex] || []
    const stateValue = getState(stateId)
    const data = [[stateId], [stateValue], [stateValue], [stateDenseIndex]] as WatcherData

    if (!Array.isArray(runtime.stateValueWatchers[stateDenseIndex])) {
        runtime.stateValueWatchers[stateDenseIndex] = stateValueWatchersArray
    }

    incrementStateReference(stateDenseIndex)
    stateValueWatchersArray.push(denseIndex)
    runtime.stateWatchersData[denseIndex] = data

    return id
}