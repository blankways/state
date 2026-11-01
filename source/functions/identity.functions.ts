import { Identity } from '@blankways/identity'
import { runtime } from '@/runtime.js'
import type { StateId } from '@/types/state.types.js'

export function createStateId<Type>(): StateId<Type> {
    return Identity.Identifier.create(runtime.stateFamily)
}

export function isStateId(id: StateId<unknown>): boolean {
    return Identity.Identifier.validate(runtime.stateFamily, id) === true
}