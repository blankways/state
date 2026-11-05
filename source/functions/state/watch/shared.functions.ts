import { runtime } from '@/runtime.js'

export function incrementStateReference(stateDenseIndex: number): void {
    const currentRefs = runtime.stateValuesReferences[stateDenseIndex] || 0
    runtime.stateValuesReferences[stateDenseIndex] = currentRefs + 1

    if (currentRefs === 0) {
        const hooks = runtime.stateValuesActivatedHooks[stateDenseIndex]
        if (hooks) {
            for (let i = 0; i < hooks.length; i++) {
                hooks[i]()
            }
        }
    }
}

export function decrementStateReference(stateDenseIndex: number): void {
    const currentRefs = runtime.stateValuesReferences[stateDenseIndex] || 0
    if (currentRefs <= 0) return

    const newRefs = currentRefs - 1
    runtime.stateValuesReferences[stateDenseIndex] = newRefs

    if (newRefs === 0) {
        const hooks = runtime.stateValuesDectivatedHooks[stateDenseIndex]
        if (hooks) {
            for (let i = 0; i < hooks.length; i++) {
                hooks[i]()
            }
        }
    }
}