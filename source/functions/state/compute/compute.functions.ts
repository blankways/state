import { runtime } from '@/runtime.js'
import { unwatchState } from '../index.js'
import type { ComputeFn, StateId } from '@/types/index.js'
import { computeMultipleStates } from './multiple.functions.js'
import { computeSingleState } from './single.functions.js'

export function createCompute<Value, Type>(
  state: StateId<Value>,
  fn: ComputeFn<StateId<Value>, Type>
): StateId<Type>

export function createCompute<States extends readonly StateId<unknown>[], Type>(
  states: States,
  fn: ComputeFn<States, Type>
): StateId<Type>

export function createCompute<States extends readonly StateId<unknown>[] | StateId<unknown>, Type>(
  statesOrState: States,
  fn: ComputeFn<States, Type>
): StateId<Type> {
  if (Array.isArray(statesOrState)) {
    return computeMultipleStates(
      statesOrState as readonly StateId<unknown>[], 
      fn as unknown as ComputeFn<readonly StateId<unknown>[], Type>
    )
  } else {
    type InferredValue = States extends StateId<infer T> ? T : unknown;
    return computeSingleState(
      statesOrState as StateId<InferredValue>, 
      fn as unknown as ComputeFn<StateId<InferredValue>, Type>
    )
  }
}

export function disposeCompute(stateId: StateId<unknown>): void {
  const watcherId = runtime.computeWatchers[stateId]
  if (typeof watcherId !== 'number')
    return

  unwatchState(watcherId)
}