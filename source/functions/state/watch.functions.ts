import { Identity } from '@blankways/identity'
import { runtime } from '@/runtime.js'
import { createWatcherId } from '@/functions/identity.functions.js'
import type { StateId, WatcherId } from '@/types/state.types.js'
import type { GlobalWatcher, Watcher, WatcherSingle, WatcherTuple, WatcherData } from '@/types/state.types.js'
import { AllStatesFamily, type AllStates } from '@/utils/state.utils.js'
import { getState } from './modify.functions.js'

function incrementStateReference(stateDenseIndex: number): void {
    const currentRefs = runtime.stateValuesReferences[stateDenseIndex] || 0
    runtime.stateValuesReferences[stateDenseIndex] = currentRefs + 1

    if (currentRefs === 0) {
        const hooks = runtime.stateValuesActivatedHooks[stateDenseIndex]
        if (hooks) {
            for (let i = 0; i < hooks.length; i++) {
                hooks[i]()
            }
        }
    }
}

function decrementStateReference(stateDenseIndex: number): void {
    const currentRefs = runtime.stateValuesReferences[stateDenseIndex] || 0
    if (currentRefs <= 0) return

    const newRefs = currentRefs - 1
    runtime.stateValuesReferences[stateDenseIndex] = newRefs

    if (newRefs === 0) {
        const hooks = runtime.stateValuesDectivatedHooks[stateDenseIndex]
        if (hooks) {
            for (let i = 0; i < hooks.length; i++) {
                hooks[i]()
            }
        }
    }
}

export function watchState<T extends readonly StateId<unknown>[]>(
    ids: T,
    callback: WatcherTuple<T>
): void

export function watchState<T extends StateId<unknown> | readonly StateId<unknown>[]>(
    ids: T,
    callback: WatcherSingle<T>
): WatcherId

export function watchState(ids: AllStates, callback: GlobalWatcher): WatcherId

export function watchState<T extends StateId<unknown> | readonly StateId<unknown>[]>(
    ids: T,
    callback: Watcher
): WatcherId {
    const id = createWatcherId()

    if (Identity.Identifier.validate(AllStatesFamily, ids as unknown as AllStates) === true) {
        runtime.stateGlobalWatchersDenseIndexLookup[id] = runtime.stateGlobalWatchers.length
        runtime.stateGlobalWatchers.push(callback as GlobalWatcher)
        return id
    }

    const denseIndex = runtime.stateWatchers.length
    runtime.stateWatchersDenseIndexLookup[id] = denseIndex
    runtime.stateWatchers.push(callback)

    const isSingle = !Array.isArray(ids)
    runtime.stateWatcherIsSingle[denseIndex] = isSingle

    if (isSingle) {
        const stateId = ids as StateId<unknown>
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
    } else {
        const stateIds = ids as readonly StateId<unknown>[]
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
    }

    return id
}

export function unwatchState(watcherId: WatcherId): void {
    const denseIndex = runtime.stateWatchersDenseIndexLookup[watcherId]
    if (denseIndex === undefined) return

    const data = runtime.stateWatchersData[denseIndex]

    if (data) {
        const stateIds = data[0]
        for (let i = 0; i < stateIds.length; i++) {
            const stateId = stateIds[i]
            const stateDenseIndex = runtime.stateValuesDenseIndexLookup[stateId]

            const watchers = runtime.stateValueWatchers[stateDenseIndex]
            if (watchers) {
                const idx = watchers.indexOf(denseIndex)
                if (idx !== -1) watchers.splice(idx, 1)
            }

            decrementStateReference(stateDenseIndex)
        }
    }

    delete runtime.stateWatchersDenseIndexLookup[watcherId]
    runtime.stateWatchers[denseIndex] = undefined as unknown as Watcher
    runtime.stateWatchersData[denseIndex] = undefined as unknown as WatcherData
}