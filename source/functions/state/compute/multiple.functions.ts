import { watchState, createState, setState, getState } from '../index.js'
import type { StateId, ComputeFn, StatesValues } from '@/types/index.js'

export function computeMultipleStates<States extends readonly StateId<unknown>[], Type>(
  states: States,
  fn: ComputeFn<States, Type>
): StateId<Type> {
  const start = states.map((s) => getState(s)) as unknown as StatesValues<States>;
  const initialValue = fn(start, start, -1);
  const computedState = createState(initialValue);

  watchState(states, (_, currents, previouses, idx) => {
    const value = fn(currents as StatesValues<States>, previouses as StatesValues<States>, idx);
    setState(computedState, value);
  });

  return computedState;
}