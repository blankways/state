import { Identity } from '@blankways/identity'
import { runtime } from '@/runtime.js'
import type { StateId, WatcherId } from '@/types/index.js'

export function createStateId<Type>(): StateId<Type> {
    return Identity.Identifier.create(runtime.stateFamily)
}

export function isStateId(id: StateId<unknown>): boolean {
    return Identity.Identifier.validate(runtime.stateFamily, id) === true
}

export function createWatcherId(): WatcherId {
    return Identity.Identifier.create(runtime.watcherFamily)
}

export function isWatcherId(id: WatcherId): boolean {
    return Identity.Identifier.validate(runtime.watcherFamily, id) === true
}