import { Identity } from '@blankways/identity'

export const AllStatesFamily = Identity.Family.create<'@blankways/state(state)-all'>()
export const AllStates = Identity.Identifier.create(AllStatesFamily)
export type AllStates = typeof AllStates