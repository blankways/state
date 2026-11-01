import type { StateFamily } from '@/types/state.types.js'

export type RuntimeState = {
    readonly stateFamily: StateFamily
    readonly statevalues: Array<unknown>
    readonly stateDenseIndexLookup: Array<number>
}

