# Crypto Key 🔑

[![NPM Latest Version][version-badge]][npm-url] [![Coverage Status][coverage-badge]][coverage-url] [![Socket Status][socket-badge]][socket-url] [![NPM Monthly Downloads][downloads-badge]][npm-url] [![Dependencies][deps-badge]][deps-url]

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

[version-badge]: https://img.shields.io/npm/v/%40alessiofrittoli%2Fcrypto-key
[npm-url]: https://npmjs.org/package/%40alessiofrittoli%2Fcrypto-key
[coverage-badge]: https://coveralls.io/repos/github/alessiofrittoli/crypto-key/badge.svg
[coverage-url]: https://coveralls.io/github/alessiofrittoli/crypto-key
[socket-badge]: https://socket.dev/api/badge/npm/package/@alessiofrittoli/crypto-key
[socket-url]: https://socket.dev/npm/package/@alessiofrittoli/crypto-key/overview
[downloads-badge]: https://img.shields.io/npm/dm/%40alessiofrittoli%2Fcrypto-key.svg
[deps-badge]: https://img.shields.io/librariesio/release/npm/%40alessiofrittoli%2Fcrypto-key
[deps-url]: https://libraries.io/npm/%40alessiofrittoli%2Fcrypto-key

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

## Lightweight TypeScript library for Node.js Cryptographic keys

### Table of Contents

- [Getting started](#getting-started)
- [API Reference](#api-reference)
  - [`Hash` Class](#hash-class)
    - [Methods](#methods)
      - [`Hash.digest()`](#hashdigest)
      - [`Hash.isValid()`](#hashisvalid)
    - [Example Usage](#example-usage)
  - [`Hmac` Class](#hmac-class)
    - [Methods](#methods-1)
      - [`Hmac.digest()`](#hmacdigest)
      - [`Hmac.isValid()`](#hmacisvalid)
    - [Example Usage](#example-usage-1)
  - [`Scrypt` Class](#scrypt-class)
    - [Scrypt Type Interfaces](#scrypt-type-interfaces)
      - [ScryptOptions](#scryptoptions)
      - [ScryptHashOptions](#scrypthashoptions)
    - [Methods](#methods-2)
      - [`Scrypt.hash()`](#scrypthash)
      - [`Scrypt.isValid()`](#scryptisvalid)
    - [Example Usage](#example-usage-2)
- [Development](#development)
  - [Install depenendencies](#install-depenendencies)
  - [Build the source code](#build-the-source-code)
  - [ESLint](#eslint)
  - [Jest](#jest)
- [Contributing](#contributing)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started

The `crypto-key` library it's part of the [`crypto`](https://npmjs.com/search?q=%40alessiofrittoli%2Fcrypto) utility libraries and can be installed by running the following command:

```bash
npm i @alessiofrittoli/crypto-key
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/crypto-key
```

---

### API Reference

This module supports different input data types and it uses the [`coerceToUint8Array`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer#coercetouint8array) utility function from [`@alessiofrittoli/crypto-buffer`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer) to convert it to a `Uint8Array`.

- See [`coerceToUint8Array`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer#coercetouint8array) for more informations about the supported input types.

#### `Hash` Class

The `Hash` class provides utility methods for hashing strings and validating hashed values using cryptographic algorithms.\
It supports a variety of algorithms based on the OpenSSL version available on the platform.

##### Methods

###### `Hash.digest()`

Generates a hash of a given string using a specified cryptographic algorithm.

<details>
<summary>Parameters</summary>

| Parameter   | Type                          | Default   | Description                                  |
|-------------|-------------------------------|-----------|----------------------------------------------|
| `input`     | `crypto.BinaryLike`           | -         | The data to be hashed.                       |
| `algorithm` | `Algo.Hash \| Algo.OtherHash` | 'SHA-256' | (Optional) The cryptographic hash algorithm. |

</details>

**Returns**

Type: `Buffer`

The resulting hash digest Buffer.

---

###### `Hash.isValid()`

Compares input data with a hashed value to verify if they match.

<details>
<summary>Parameters</summary>

| Parameter   | Type                          | Default   | Description                               |
|-------------|-------------------------------|-----------|-------------------------------------------|
| `input`     | `crypto.BinaryLike`           | -         | The raw input data.                       |
| `digest`    | `CoerceToUint8ArrayInput`     | -         | The hash digest value to compare against. |
| `algorithm` | `Algo.Hash \| Algo.OtherHash` | 'SHA-256' | (Optional) The hash algorithm previously used while generating the `hashed` data. |

</details>

**Returns**

Type: `boolean`

`true` if the input matches the hashed `digest` value, `false` otherwise.

---

##### Example Usage

###### Generating a Hash

```ts
import { Hash } from '@alessiofrittoli/crypto-key'
// or
import { Hash } from '@alessiofrittoli/crypto-key/Hash'

console.log(
  Hash.digest( 'raw string value' )
    .toString( 'hex' )
)
```

###### Validating a Hash

```ts
import { Hash } from '@alessiofrittoli/crypto-key'
// or
import { Hash } from '@alessiofrittoli/crypto-key/Hash'

const rawInput	= 'raw string value'
const hash		= Hash.digest( rawInput )
const isValid	= Hash.isValid( rawInput, hash )

console.log( isValid ) // Outputs: `true`
```

---

#### `Hmac` Class

The `Hmac` class provides utility methods for generating and validating HMAC (Hash-based Message Authentication Code) values using cryptographic algorithms.

##### Methods

###### `Hmac.digest()`

Generates a Hash-based Message Authentication Code (HMAC) for a given message using a secret key.

<details>
<summary>Parameters</summary>

| Parameter   | Type                | Default   | Description                                     |
|-------------|---------------------|-----------|-------------------------------------------------|
| `message`   | `crypto.BinaryLike` | -         | The data to be hashed.                          |
| `secret`    | `crypto.BinaryLike \| crypto.KeyObject` | - | The secret key to use for generating the HMAC. |
| `algorithm` | `Algo.Hash`         | 'SHA-256' | (Optional) The cryptographic hash algorithm.    |
| `encoding`  | `BufferEncoding`    | -         | (Optional) The encoding for the output string.  |
| `options`   | `stream.TransformOptions` | -   | (Optional) Additional stream transform options. |

</details>

**Returns**

Type: `HmacReturnType<T>`

The resulting HMAC value. If `encoding` is specified, the output is a string in the specified encoding; otherwise, a `Buffer`.

---

###### `Hmac.isValid()`

Validates a given HMAC value against a message and secret key.

<details>
<summary>Parameters</summary>

| Parameter   | Type                | Default   | Description                                     |
|-------------|---------------------|-----------|-------------------------------------------------|
| `digest`    | `CoerceToUint8ArrayInput` | -   | The HMAC digest to validate.                    |
| `message`   | `crypto.BinaryLike` | -         | The original message used to generate the HMAC. |
| `secret`    | `crypto.BinaryLike \| crypto.KeyObject` | - | The secret key used for generating the HMAC. |
| `algorithm` | `Algo.Hash`         | 'SHA-256' | (Optional) The hash algorithm used for generating the HMAC. |
| `encoding`  | `BufferEncoding`    | -         | (Optional) The encoding used to generate the hash output. |
| `options`   | `stream.TransformOptions` | -   | (Optional) Additional stream transform options used for generating the HMAC. |

</details>

**Returns**

Type: `boolean`

`true` if the provided HMAC matches the generated one. `false` otherwise.

---

##### Example Usage

###### Generating an HMAC

```ts
import { Hmac } from '@alessiofrittoli/crypto-key'
// or
import { Hmac } from '@alessiofrittoli/crypto-key/Hmac'

console.log(
  Hmac.digest( 'raw string value', 'mysecretkey', 'SHA-256', 'hex' )
) // Outputs the HMAC value in HEX format.
```

###### Validating an HMAC

```ts
import { Hmac } from '@alessiofrittoli/crypto-key'
// or
import { Hmac } from '@alessiofrittoli/crypto-key/Hmac'

const message	= 'raw string value'
const secret	= 'mysecretkey'
const hmac		= Hmac.digest( message, secret )

console.log(
  Hmac.isValid( hmac, message, secret )
) // Outputs: `true`
```

---

#### `Scrypt` Class

The `Scrypt` class provides methods for hashing and securely comparing keys using the `scrypt` key derivation algorithm.\
It supports customizable options for computational cost, memory usage, and parallelization to balance security and performance.

##### Scrypt Type Interfaces

###### `ScryptOptions`

Defines customization options for the `scrypt` algorithm.

<details>
<summary>Properties</summary>

| Property          | Type     | Default   | Description |
|-------------------|----------|-----------|-------------|
| `cost`            | `number` | `16384`   | Computational cost factor. Must be a power of 2. Higher values increase security but are slower. |
| `blockSize`       | `number` | `8`       | Memory cost factor. Higher values increase memory usage, improving security against GPU attacks. |
| `parallelization` | `number` | `1`       | Parallelization factor. Determines how many threads can be used. |
| `maxmem`          | `number` | `32 * 1024 * 1024` (32MB) | Maximum memory (in bytes) to be used during key derivation. |
| `N`               | `number` | `16384`   | Alias for `cost`. |
| `r`               | `number` | `8`       | Alias for `blockSize`. |
| `p`               | `number` | `1`       | Alias for `parallelization`. |

</details>

<details>
<summary>Suggested options</summary>

| Scope                       | `cost` (N) | `blockSize` (r) | `parallelization` (p) | `maxmem` |
|-----------------------------|------------|-----------------|-----------------------|----------|
| Standard security (default) | `16384`    | `8`             | `1`                   | 32 MB    |
| High security               | `65536`    | `16`            | `1`                   | 64 MB    |
| Limited resources           | `8192`     | `4`             | `1`                   | 16 MB    |

</details>

---

###### `ScryptHashOptions`

Defines options for the `hash` and `isValid` methods.

<details>
<summary>Properties</summary>

| Property     | Type            | Default   | Description |
|--------------|-----------------|-----------|-------------|
| `length`     | `number`        | `64`      | The hash length. Must be between `16` and `256`. |
| `saltLength` | `number`        | `32`      | The salt length. Must be between `16` and `64`. |
| `options`    | `ScryptOptions` | See above | Custom options for the `scrypt` algorithm. |

</details>

---

##### Methods

###### `Scrypt.hash()`

Generates a hash for a given key using the `scrypt` key derivation algorithm.

<details>
<summary>Parameters</summary>

| Parameter | Type                | Default | Description |
|-----------|---------------------|---------|-------------|
| `key`     | `crypto.BinaryLike` | -       | The key to hash. |
| `options` | `ScryptHashOptions` | -       | (Optional) Configuration options for hashing. |

</details>

**Returns**

Type: `Buffer`

A Buffer containing the salt (first saltLength bytes) followed by the derived hash.

---

###### `Scrypt.isValid()`

Validates the given `key` with the given `hash`.

<details>
<summary>Parameters</summary>

| Parameter | Type                | Default | Description |
|-----------|---------------------|---------|-------------|
| `key`     | `crypto.BinaryLike` | -       | The key to validate. |
| `hash`    | `CoerceToUint8ArrayInput` | - | The hash to compare against. |
| `options` | `ScryptHashOptions` | -       | (Optional) Configuration options. Must match those used for hashing. |

</details>

**Returns**

Type: `boolean`

`true` if the key is valid, `false` otherwise.

---

##### Example Usage

###### Hashing a Key

```ts
import { Scrypt } from '@alessiofrittoli/crypto-key'
// or
import { Scrypt } from '@alessiofrittoli/crypto-key/Scrypt'

console.log(
  Scrypt.hash( 'user-provided-password' )
    .toString( 'hex' )
) // Outputs the hash in HEX format.
```

###### Validating a Key

```ts
import { Scrypt } from '@alessiofrittoli/crypto-key'
// or
import { Scrypt } from '@alessiofrittoli/crypto-key/Scrypt'

import { Scrypt } from './Scrypt';

const password	= 'user-provided-password';
const hash		= Scrypt.hash( password, { length: 32, saltLength: 16 } )

console.log(
  Scrypt.isValid( password, hash, { length: 32, saltLength: 16 } )
) // Outputs: true
```

---

### Development

#### Install depenendencies

```bash
npm install
```

or using `pnpm`

```bash
pnpm i
```

#### Build the source code

Run the following command to test and build code for distribution.

```bash
pnpm build
```

#### [ESLint](https://www.npmjs.com/package/eslint)

warnings / errors check.

```bash
pnpm lint
```

#### [Jest](https://npmjs.com/package/jest)

Run all the defined test suites by running the following:

```bash
# Run tests and watch file changes.
pnpm test:watch

# Run tests and watch file changes with jest-environment-jsdom.
pnpm test:jsdom

# Run tests in a CI environment.
pnpm test:ci

# Run tests in a CI environment with jest-environment-jsdom.
pnpm test:ci:jsdom
```

You can eventually run specific suits like so:

- See [`package.json`](./package.json) file scripts for more info.

```bash
pnpm test:jest
pnpm test:jest:jsdom
```

Run tests with coverage.

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```bash
test:coverage:serve
```

---

### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
