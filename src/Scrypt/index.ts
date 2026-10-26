import type { CoerceToUint8ArrayInput } from '@alessiofrittoli/crypto-buffer'
import { coerceToUint8Array } from '@alessiofrittoli/crypto-buffer'
import crypto from 'crypto'

/**
 * Scrypt algorithm customization options.
 *
 * ### Available options:
 *
 * | Property          | Default   | Description                                                                                      |
 * |-------------------|-----------|--------------------------------------------------------------------------------------------------|
 * | `cost`            | `16384`   | Computational cost factor. Must be a power of 2. Higher values increase security but are slower. |
 * | `blockSize`       | `8`       | Memory cost factor. Higher values increase memory usage, improving security against GPU attacks. |
 * | `parallelization` | `1`       | Parallelization factor. Determines how many threads can be used.                                 |
 * | `maxmem`          | `32 * 1024 * 1024` (32MB) | Maximum memory (in bytes) to be used during key derivation.                      |
 * | `N`               | `16384`   | Alias for `cost`.                                                                                |
 * | `r`               | `8`       | Alias for `blockSize`.                                                                           |
 * | `p`               | `1`       | Alias for `parallelization`.                                                                     |
 *
 *
 * ### Suggested options:
 *
 * | Scope                       | `cost` (N) | `blockSize` (r) | `parallelization` (p) | `maxmem` |
 * |-----------------------------|------------|-----------------|-----------------------|----------|
 * | Standard security (default) | `16384`    | `8`             | `1`                   | 32 MB    |
 * | High security               | `65536`    | `16`            | `1`                   | 64 MB    |
 * | Limited resources           | `8192`     | `4`             | `1`                   | 16 MB    |
 */
export interface ScryptOptions extends crypto.ScryptOptions {
	/**
	 * Computational cost factor. Must be a power of 2. Higher values increase security but are slower.
	 *
	 */
	cost?: number
	/**
	 * Memory cost factor. Higher values increase memory usage, improving security against GPU attacks.
	 *
	 */
	blockSize?: number
	/**
	 * Parallelization factor. Determines how many threads can be used.
	 *
	 */
	parallelization?: number
	/**
	 * Maximum memory (in bytes) to be used during key derivation.
	 *
	 */
	maxmem?: number
	/**
	 * Alias for `cost`.
	 *
	 */
	N?: number
	/**
	 * Alias for `blockSize`.
	 *
	 */
	r?: number
	/**
	 * Alias for `parallelization`.
	 *
	 */
	p?: number
}

export interface ScryptHashOptions {
	/**
	 * The hash length. Minimum: `16`, Maximum: `256`.
	 *
	 * @default 64
	 */
	length?: number
	/**
	 * The salt length. Minimum: `16`, Maximum: `64`.
	 *
	 * @default 32
	 */
	saltLength?: number
	/**
	 * Scrypt algorithm customization options. See {@link ScryptOptions} for available options.
	 *
	 */
	options?: ScryptOptions
}

/**
 * Scrypt Utility static class.
 *
 * Requires the following packages to be installed:
 *
 * - [`@alessiofrittoli/crypto-buffer`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer)
 */
export class Scrypt {
	private static readonly SALT_LENGTH = {
		min: 16,
		max: 64,
		default: 32,
	}

	private static readonly HASH_LENGTH = {
		min: 16,
		max: 256,
		default: 64,
	}

	/**
	 * Hash string using the scrypt key derivation algorithm.
	 *
	 * @param	key		The key to hash. Can be a string, Buffer, or TypedArray.
	 * @param	options	( Optional ) An object with configuration options. See {@link ScryptHashOptions} for avilable options.
	 * @returns	A Buffer containing the salt (first `saltLength` bytes) followed by the derived hash.
	 */
	public static hash(key: crypto.BinaryLike, options: ScryptHashOptions = {}): Buffer {
		const { length = Scrypt.HASH_LENGTH.default, saltLength = Scrypt.SALT_LENGTH.default } = options

		const safeLength = Math.min(Math.max(length, Scrypt.HASH_LENGTH.min), Scrypt.HASH_LENGTH.max)
		const safeSaltLength = Math.min(Math.max(saltLength, Scrypt.SALT_LENGTH.min), Scrypt.SALT_LENGTH.max)

		const salt = crypto.randomBytes(safeSaltLength)
		const buffer = crypto.scryptSync(key, salt, safeLength, options.options)

		return Buffer.concat([salt, buffer])
	}

	/**
	 * Compare key with hash.
	 *
	 * @param key		The key to compare.
	 * @param hash		The hash string.
	 * @param options	( Optional ) An object with configuration options. See {@link ScryptHashOptions} for avilable options.
	 *
	 * @usage ```ts
	 * const password		= 'your-strong-password'
	 * const secretKey		= Scrypt.hash( password, { length: 16 } ) // store in database.
	 * const isValidPassword	= Scrypt.isValid( password, secretKey, { length: 16 } )
	 * ```
	 * @returns	True if key is valid, false otherwise. Throw error if no secret or salt has been found in the hash.
	 */
	public static isValid(
		key: crypto.BinaryLike,
		hash: CoerceToUint8ArrayInput,
		options: ScryptHashOptions = {},
	): boolean {
		if (!hash) return false

		let _hash = coerceToUint8Array(hash)

		if (_hash.length <= 0) return false

		try {
			const { length = Scrypt.HASH_LENGTH.default, saltLength = Scrypt.SALT_LENGTH.default } = options

			const safeLength = Math.min(Math.max(length, Scrypt.HASH_LENGTH.min), Scrypt.HASH_LENGTH.max)
			const safeSaltLength = Math.min(
				Math.max(saltLength, Scrypt.SALT_LENGTH.min),
				Scrypt.SALT_LENGTH.max,
			)

			const salt = _hash.subarray(0, safeSaltLength)
			_hash = _hash.subarray(safeSaltLength)

			if (_hash.length !== safeLength) {
				return false
			}

			const buffer = crypto.scryptSync(key, salt, safeLength, options.options)

			return crypto.timingSafeEqual(_hash, buffer)
		} catch {
			return false
		}
	}
}
