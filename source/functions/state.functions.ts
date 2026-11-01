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