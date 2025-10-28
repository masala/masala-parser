# Parser Combinator: Numbers Bundle

**Import**

```ts
import { N, Streams } from '@masala/parser'
```

## Number parser

- `N.number()` → parses a **signed decimal** number (optional fraction, optional
  exponent).
- Grammar (informal):
  `[+-]? ( digits ( "." digits? )? | "." digits ) ( [eE] [+-]? digits )?`

The parsing is returned as a JavaScript type `number`.

**Notes**

- No implicit whitespace skipping. Trim or compose explicitly.
- Decimal only: **no** hex (`0x`), octal, binary, underscores, `Infinity`, or
  `NaN`.

**Examples**

```ts
N.number().parse(Streams.ofChars('42')) // → 42
N.number().parse(Streams.ofChars('-12.5')) // → -12.5
N.number().parse(Streams.ofChars('3.1e-2')) // → 0.031
```

Grammar: `[+-]? (digits ("." digits?)? | "." digits) ([eE][+-]?digits)?`

**Composing**

```ts
const ratio = N.number().then(C.char('/')).then(N.number())
// parses "12/7", returns a tuple-like chain per your combinator semantics
```

## digits()

- `N.digit()` → one ASCII digit `0–9`; returns a char.
- `N.digits()` → one-or-more digits; returns a string.

**Examples**

```ts
N.digit().parse(Streams.ofChars('7')) // '7'
N.digits().parse(Streams.ofChars('1234')) // '1234'
```
