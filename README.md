# @blankways/state

Type-safe lightweight state and reactivity management library.

## Usage

```ts
import { State, type StateId, type WatcherId } from '@blankways/state'

interface ShoppingCartItem {
    id: string
    name: string
    price: number
    quantity: number
}

const cartState: StateId<ShoppingCartItem[]> = State.create([])
const couponDiscountState: StateId<number> = State.create(0)

const cartSubtotalState: StateId<number> = State.compute(
    cartState, 
    (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const cartTotalState: StateId<number> = State.compute(
    [cartSubtotalState, couponDiscountState],
    ([subtotal, discount]) => Math.max(0, subtotal - discount)
)

const cartItemCountState: StateId<number> = State.compute(
    cartState,
    (items) => items.reduce((sum, item) => sum + item.quantity, 0)
)

const checkoutAnalyticsWatcherId: WatcherId = State.watch(
    [cartTotalState, cartItemCountState],
    ([totalId, countId], [total, count], [prevTotal, prevCount], updatedIndex) => {}
)

State.activated(cartState, () => {})
State.deactivated(cartState, () => {})

State.set(cartState, [
    { id: 'p1', name: 'Teclado Mecánico', price: 80, quantity: 1 }
])

State.set(couponDiscountState, 15)

const currentCart: ShoppingCartItem[] = State.get(cartState)
const currentTotal: number = State.get(cartTotalState)

State.unwatch(checkoutAnalyticsWatcherId)
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
- An array of `StateId`
- `State.AllStates` to listen for changes globally across all states

Returns a `WatcherId` used to cancel the subscription.

### `State.unwatch(watcherId)`

Removes a registered watcher subscription using its `WatcherId`.

### `State.activated(stateId, callback)`

Registers a callback that is invoked when the state transitions to an active state (i.e., when its active watcher count goes from `0` to `1`).

### `State.deactivated(stateId, callback)`

Registers a callback that is invoked when the state transitions to an inactive state (i.e., when its active watcher count drops to `0`).

### `State.compute(target, callback)`

Subscribes a callback to changes in state and returns a state which gets updated with the callback return. The `target` can be:
- A single `StateId`
- An array of `StateId`