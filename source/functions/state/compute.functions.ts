import { watchState, createState, setState, getState } from './index.js'
import type { ComputeFn, StatesValues, StateId } from '@/types/state.types.js'

export function createCompute<T, Type>(
  state: StateId<T>,
  fn: (current: T, previous: T, idx: number) => Type
): StateId<Type>;

export function createCompute<States extends readonly StateId<unknown>[], Type>(
  states: States,
  fn: ComputeFn<States, Type>
): StateId<Type>;

export function createCompute<States extends readonly StateId<unknown>[] | StateId<unknown>, Type>(
  statesOrState: States,
  fn: States extends readonly StateId<unknown>[] 
    ? ComputeFn<States, Type> 
    : States extends StateId<infer T> 
      ? (current: T, previous: T, idx: number) => Type 
      : never
): StateId<Type> {
  const isArray = Array.isArray(statesOrState);
  const states = (isArray ? statesOrState : [statesOrState]) as readonly StateId<unknown>[];

  const start = states.map((s) => getState(s)) as unknown as States extends readonly StateId<unknown>[] 
    ? StatesValues<States> 
    : States extends StateId<infer T> 
      ? T 
      : never;

  const initialValue = isArray
    ? (fn as ComputeFn<readonly StateId<unknown>[], Type>)(start as StatesValues<readonly StateId<unknown>[]>, start as StatesValues<readonly StateId<unknown>[]>, -1)
    : (fn as (current: unknown, previous: unknown, idx: number) => Type)(start, start, -1);

  let state = createState(initialValue);

  watchState(states, (_, currents, previouses, idx) => {
    const value = isArray
      ? (fn as ComputeFn<readonly StateId<unknown>[], Type>)(currents, previouses, idx)
      : (fn as (current: unknown, previous: unknown, idx: number) => Type)(currents[0], previouses[0], idx);
      
    setState(state, value);
  });

  return state;
}