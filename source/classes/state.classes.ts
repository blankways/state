import { createState, setState, getState, watchState, unwatchState, activateState, deactivateState } from '@/functions/index.js'
import { AllStates } from '@/utils/state.utils.js'

export class State {
    static readonly create = createState
    static readonly set = setState
    static readonly get = getState
    static readonly watch = watchState
    static readonly unwatch = unwatchState
    static readonly activated = activateState
    static readonly deactivated = deactivateState
    static readonly AllStates = AllStates
}