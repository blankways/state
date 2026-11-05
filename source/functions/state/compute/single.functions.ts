import { watchState, createState, setState, getState } from '../index.js'
import type { ComputeFn, StateId } from '@/types/index.js'

export function computeSingleState<Value, Type>(
  state: StateId<Value>,
  fn: (current: Value, previous: Value, idx: number) => Type
): StateId<Type> {
  const currentVal = getState(state);
  const initialValue = fn(currentVal, currentVal, -1);
  const computedState = createState(initialValue);

  watchState(state, (curr, prev, idx) => {
    setState(computedState, fn(curr as Value, prev as Value, idx));
  });

  return computedState;
}