# @blankways/state

Type-safe lightweight state and reactivity management library.

## Usage

```ts
import { State, type StateId } from '@blankways/state'

const state: StateId<number> = State.create(5)
const state2 = State.create('Hello world')

const value = State.get(state)

State.set(state, 50)

const watcherId = State.watch(state, (id, value, prev) => {
    console.log(`State 1 value changed from ${prev} to ${value}`)
})

State.watch([state, state2], ([id, id2], [values, values2], [prevs, prevs2], updatedIdx) => {
    console.log(`One of the states changed at index: ${updatedIdx}`)
})

State.watch(State.AllStates, (id, value, prev) => {
    console.log(`Global change on state ID ${id}: ${prev} -> ${value}`)
})

State.activated(state, () => {
    console.log('State has become active (at least 1 active watcher).')
})

State.deactivated(state, () => {
    console.log('State has become inactive (reference count dropped to 0).')
})

State.unwatch(watcherId)
```

`StateId` values are represented as numbers at runtime. Their type markers exist only in TypeScript: they distinguish identifiers types from simple numbers, by family.

## API

### `State.create<T>(initialValue)`

Creates a new state with the given initial value and returns a `StateId<T>`. `T` is a compile-time type marker that associates the state identifier with its value type.

### `State.get(stateId)`

Returns the current value associated with the specified `stateId`.

### `State.set(stateId, value)`

Updates the value of the state identified by `stateId` and triggers notifications to all matching active watchers.

### `State.watch(target, callback)`

Subscribes a callback to changes in state. The `target` can be:
- A single `StateId`
- An array of `StateId` instances
- `State.AllStates` to listen for changes globally across all states

Returns a `WatcherId` used to cancel the subscription.

### `State.unwatch(watcherId)`

Removes a registered watcher subscription using its `WatcherId`.

### `State.activated(stateId, callback)`

Registers a callback that is invoked when the state transitions to an active state (i.e., when its active watcher count goes from `0` to `1`).

### `State.deactivated(stateId, callback)`

Registers a callback that is invoked when the state transitions to an inactive state (i.e., when its active watcher count drops to `0`).