import type { Family, Identifier } from '@blankways/identity'

export type StateFamily = Family<'@blankways/state(state)'>
export type StateId<Type> = Identifier<StateFamily, Type>