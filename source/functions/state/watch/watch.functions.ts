import { Identity } from '@blankways/identity'
import { runtime } from '@/runtime.js'
import { createWatcherId } from '@/functions/index.js'
import { decrementStateReference, watchGlobalState, watchSingleState, watchMultipleStates } from './index.js'
import { AllStatesFamily, type AllStates } from '@/utils/state.utils.js'
import type { StateId, WatcherId, GlobalWatcher, Watcher, WatcherSingle, WatcherMultiple, WatcherData } from '@/types/index.js'

export function watchState<T extends readonly StateId<unknown>[]>(
    ids: T,
    callback: WatcherMultiple<T>
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
        return watchGlobalState(callback as GlobalWatcher)
    }

    if (Array.isArray(ids)) {
        return watchMultipleStates(id, ids as readonly StateId<unknown>[], callback)
    }

    return watchSingleState(id, ids as StateId<unknown>, callback)
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