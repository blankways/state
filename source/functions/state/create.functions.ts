import { runtime } from '@/runtime.js'
import { createStateId } from '@/functions/index.js'
import type { StateId } from '@/types/index.js'

export function createState<Type>(value: Type): StateId<Type> {
    const id = createStateId<Type>()

    const denseIndex = runtime.stateValues.length
    runtime.stateValuesDenseIndexLookup[id] = denseIndex
    runtime.stateValues.push(value)

    return id
}