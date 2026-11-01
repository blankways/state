import { runtime } from '@/runtime.js'
import { createStateId } from '@/functions/identity.functions.js'
import type { StateId } from '@/types/state.types.js'

export function createState<Type>(value: Type): StateId<Type> {
    const id = createStateId<Type>()

    const denseIndex = runtime.statevalues.length
    runtime.stateDenseIndexLookup[id] = denseIndex
    runtime.statevalues.push(value)

    return id
}

export function getState<Type>(id: StateId<Type>): Type {
    const denseIndex = runtime.stateDenseIndexLookup[id]
    return runtime.statevalues[denseIndex] as Type
}

export function setState<Type>(id: StateId<Type>, value: Type) {
    const denseIndex = runtime.stateDenseIndexLookup[id]
    runtime.statevalues[denseIndex] = value
}