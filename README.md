# Crypto Key 🔑

Version 1.0.0

## Lightweight TypeScript library for Node.js Cryptographic keys

### Table of Contents

- [Getting started](#getting-started)
- [API Reference](#api-reference)
	- [`Hash` Class](#hash-class)
	- [`Hmac` Class](#hmac-class)
	- [`Cipher` Class](#cipher-class)
	- [`Scrypt` Class](#scrypt-class)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `crypto-key` in your projects:

```bash
npm i @alessiofrittoli/crypto-key
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/crypto-key
```

---

### API Reference

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
| `digest`    | `ToDataViewInput`             | -         | The hash digest value to compare against. |
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

###### `Hash.digest()`

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

###### `Hash.isValid()`

Validates a given HMAC value against a message and secret key.

<details>
<summary>Parameters</summary>

| Parameter   | Type                | Default   | Description                                     |
|-------------|---------------------|-----------|-------------------------------------------------|
| `digest`    | `ToDataViewInput`   | -         | The HMAC digest to validate.                    |
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
		.toString( 'hex' )
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

#### `Cipher` Class

##### Methods

---

##### Example Usage

---

#### `Scrypt` Class

##### Methods

---

##### Example Usage

---

### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

### Made with ☕

<table style='display:flex;gap:20px;'>
	<tbody>
		<tr>
			<td>
				<img src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
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