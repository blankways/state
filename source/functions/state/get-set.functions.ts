import { runtime } from '@/runtime.js'
import type { StateId, WatcherSingle, WatcherMultiple } from '@/types/index.js'

export function getState<Type>(id: StateId<Type>): Type {
    const denseIndex = runtime.stateValuesDenseIndexLookup[id]
    return runtime.stateValues[denseIndex] as Type
}

export function setState<Type>(id: StateId<Type>, value: Type) {
    const denseIndex = runtime.stateValuesDenseIndexLookup[id]
    const prev = runtime.stateValues[denseIndex] as Type
    runtime.stateValues[denseIndex] = value

    for (const globalWatcher of runtime.stateGlobalWatchers) {
        globalWatcher(id, value, prev)
    }

    const stateValueWatchersArray = runtime.stateValueWatchers[denseIndex]
    if (stateValueWatchersArray) {
        for (const watcherIdx of stateValueWatchersArray) {
            const watcher = runtime.stateWatchers[watcherIdx]
            if (!watcher) throw new Error(`Internal @blankways/state Error: Watcher at index ${watcherIdx} not found.`)

            const data = runtime.stateWatchersData[watcherIdx]
            if (!data) throw new Error(`Internal @blankways/state Error: Watcher data at index ${watcherIdx} not found.`)

            const isSingle = runtime.stateWatcherIsSingle[watcherIdx]
            if (isSingle) {
                data[2][0] = data[1][0]
                data[1][0] = value

                const singleWatcher = watcher as WatcherSingle<unknown>
                singleWatcher(data[0][0] as StateId<Type>, data[1][0] as Type, data[2][0] as Type)
            } else {
                const localIdx = data[3][denseIndex]

                data[2][localIdx] = data[1][localIdx]
                data[1][localIdx] = value

                const tupleWatcher = watcher as WatcherMultiple<readonly StateId<unknown>[]>
                tupleWatcher(data[0], data[1], data[2], localIdx)
            }
        }
    }
}

export function activateState<T>(id: StateId<T>, callback: () => void): void {
    const stateDenseIndex = runtime.stateValuesDenseIndexLookup[id]
    if (stateDenseIndex === undefined) return

    let hooks = runtime.stateValuesActivatedHooks[stateDenseIndex]
    if (!hooks) {
        hooks = [] as unknown as [() => void]
        runtime.stateValuesActivatedHooks[stateDenseIndex] = hooks
    }

    hooks.push(callback)
}

export function deactivateState<T>(id: StateId<T>, callback: () => void): void {
    const stateDenseIndex = runtime.stateValuesDenseIndexLookup[id]
    if (stateDenseIndex === undefined) return

    let hooks = runtime.stateValuesDectivatedHooks[stateDenseIndex]
    if (!hooks) {
        hooks = [] as unknown as [() => void]
        runtime.stateValuesDectivatedHooks[stateDenseIndex] = hooks
    }

    hooks.push(callback)
}