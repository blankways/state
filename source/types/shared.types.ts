import type { Family, Identifier } from '@blankways/identity'

export type StateFamily = Family<'@blankways/state(state)'>
export type StateId<Type> = Identifier<StateFamily, Type>

export type ExtractStateValue<T> = T extends StateId<infer U> ? U : never