import { runtime } from '@/runtime.js'
import { getState } from '@/functions/index.js'
import { incrementStateReference } from './shared.functions.js'
import type { StateId, WatcherId, Watcher, WatcherData } from '@/types/index.js'

export function watchMultipleStates(id: WatcherId, stateIds: readonly StateId<unknown>[], callback: Watcher): WatcherId {
    const denseIndex = runtime.stateWatchers.length
    runtime.stateWatchersDenseIndexLookup[id] = denseIndex
    runtime.stateWatchers.push(callback)
    runtime.stateWatcherIsSingle[denseIndex] = false

    const idArray = [...stateIds]
    const valueArray = idArray.map((stateId) => getState(stateId))
    const previousArray = [...valueArray]
    const stateIndexToWatcherSlot: number[] = []
    
    for (let i = 0; i < stateIds.length; i++) {
        const stateId = stateIds[i]
        const stateDenseIndex = runtime.stateValuesDenseIndexLookup[stateId]
        const stateValueWatchersArray = runtime.stateValueWatchers[stateDenseIndex] || []

        if (!Array.isArray(runtime.stateValueWatchers[stateDenseIndex])) {
            runtime.stateValueWatchers[stateDenseIndex] = stateValueWatchersArray
        }

        stateIndexToWatcherSlot[stateDenseIndex] = i
        incrementStateReference(stateDenseIndex)
        stateValueWatchersArray.push(denseIndex)
    }

    const data = [idArray, valueArray, previousArray, stateIndexToWatcherSlot] as WatcherData
    runtime.stateWatchersData[denseIndex] = data

    return id
}