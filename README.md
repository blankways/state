# @blank-js/identity

Type-safe numeric identifiers associated with a family. Each family maintains its own counter, so its identifiers start at `0` and increment independently.

## Usage

```ts
import { Identity } from '@blank-js/identity'

type User = { name: string }

const userFamily = Identity.Family.create<'users'>()
const firstUserId = Identity.Identifier.create<typeof userFamily, User>(userFamily)

if (Identity.Identifier.validate(userFamily, firstUserId)) {
    // The identifier was created for this family.
}
```

`Family` and `Identifier` values are represented as numbers at runtime. Their type markers exist only in TypeScript: they distinguish families and identifier types at compile time but do not change the numeric value.

## API

### `Identity.Family.create<Name>()`

Creates a new family and returns a `Family<Name>`. `Name` is an optional compile-time label; it does not change the generated value. If omitted, the default label type is `'no-family'`.

### `Identity.Identifier.create<Family, Type>(family)`

Creates the next sequential identifier for the family and returns an `Identifier<Family, Type>`. `Type` associates the identifier with an entity type. Throws an error if the family was not created by the current library instance.

### `Identity.Identifier.validate(family, id)`

Returns `true` if the identifier's numeric value is registered in the family; otherwise, returns `false`. Throws an error if the family is invalid.

## Development

- `pnpm test`: runs the Vitest test suite.
- `pnpm typecheck`: checks TypeScript types.
- `pnpm build`: generates the distribution files.
