import { describe, expect, it, vi } from 'vitest'
import { State } from '@/classes/state.classes.js'

describe('State', () => {
    it('creates a new state and returns its incremental id, which should start at 0', () => {
        expect(State.create(50)).toBe(0)
    })

    it('retrieves the value of a state given its id', () => {
        const state = State.create(100)
        expect(State.get(state)).toBe(100)
    })

    it('updates the value of a state given its id', () => {
        const state = State.create(200)
        State.set(state, 300)
        expect(State.get(state)).toBe(300)
    })

    it('watches single state changes and passes current, previous, and id correctly', () => {
        const state = State.create('initial')
        const callback = vi.fn()

        State.watch(state, callback)

        State.set(state, 'updated')

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(state, 'updated', 'initial')
    })

    it('watches tuple state changes and provides the correct updatedIdx', () => {
        const stateA = State.create('A')
        const stateB = State.create('B')
        const callback = vi.fn()

        State.watch([stateA, stateB], callback)

        State.set(stateB, 'B-updated')

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(
            [stateA, stateB],
            ['A', 'B-updated'],
            ['A', 'B'],
            1
        )
    })

    it('watches all states using State.AllStates and passes id, current, and previous', () => {
        const stateA = State.create(10)
        const callback = vi.fn()

        State.watch(State.AllStates, callback)

        State.set(stateA, 15)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(stateA, 15, 10)
    })

    it('triggers activated when a state reference count goes from 0 to 1 and deactivated when it drops back to 0', () => {
        const state = State.create('test')
        const onActivate = vi.fn()
        const onDeactivate = vi.fn()

        State.activated(state, onActivate)
        State.deactivated(state, onDeactivate)

        expect(onActivate).not.toHaveBeenCalled()
        expect(onDeactivate).not.toHaveBeenCalled()

        const watcherId = State.watch(state, () => {})

        expect(onActivate).toHaveBeenCalledTimes(1)
        expect(onDeactivate).not.toHaveBeenCalled()

        State.unwatch(watcherId)

        expect(onDeactivate).toHaveBeenCalledTimes(1)
    })
})