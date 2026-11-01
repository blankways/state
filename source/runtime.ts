import { Identity } from '@blankways/identity'
import type { RuntimeState } from '@/types/runtime.types.js'

// State shared by API functions for the lifetime of this module.
export const runtime: RuntimeState = {
    stateFamily: Identity.Family.create<'@blankways/state(state)'>(),
    statevalues: new Array<unknown>(),
    stateDenseIndexLookup: new Array<number>()
}