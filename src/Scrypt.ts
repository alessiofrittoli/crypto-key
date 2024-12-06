import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import type { BinaryLike, ScryptOptions as CryptoScryptOptions } from 'crypto'

/**
 * Scrypt algorithm customization options.
 * 
 * ### Available options:
 * 
 * | Parameter         | Default   | Description                                                                                      |
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
export interface ScryptOptions extends CryptoScryptOptions
{
	/** Computational cost factor. Must be a power of 2. Higher values increase security but are slower. */
	cost?: number
	/** Memory cost factor. Higher values increase memory usage, improving security against GPU attacks. */
	blockSize?: number
	/** Parallelization factor. Determines how many threads can be used. */
	parallelization?: number
	/** Maximum memory (in bytes) to be used during key derivation. */
	maxmem?: number
	/** Alias for `cost`. */
	N?: number
	/** Alias for `blockSize`. */
	r?: number
	/** Alias for `parallelization`. */
	p?: number
}

/** `Scrypt.hash()` input data. */
interface ScryptHashInput
{
	/** The key to hash. Can be a string, Buffer, or TypedArray. */
	key: BinaryLike
	/** The hash length. Minimum: `16`, Maximum: `256`. Default: `64`. */
	length?: number
	/** The salt length. Minimum: `16`, Maximum: `64`. Default: `32`. */
	saltLength?: number
	/** Scrypt algorithm customization options. See {@link ScryptOptions} for available options. */
	options?: ScryptOptions
}


/** `Scrypt.isValid()` input data. */
interface ScryptValidateInput
{
	/** The key to compare. */
	key: BinaryLike
	/** The hash string. */
	hash: Buffer
	/** ( Optional ) The hash length previously used within {@link Scrypt.hash}. Minimum `16`. Maximum `256`. Default: `64`. */
	length?: number
	/** ( Optional ) The salt length previously used within {@link Scrypt.hash}. Minimum `16`. Maximum `64`. Default: `32`. */
	saltLength?: number
	/** ( Optional ) Scrypt algorithm customization options previously used within {@link Scrypt.hash}. See {@link ScryptOptions} for available options. */
	options?: ScryptOptions
}


/**
 * Scrypt Utility static class.
 * 
 */
class Scrypt
{
	private static SALT_LENGTH = {
		min		: 16,
		max		: 64,
		default	: 32,
	}


	private static HASH_LENGTH = {
		min		: 16,
		max		: 256,
		default	: 64,
	}


	/**
	 * Hash string using the scrypt key derivation algorithm.
	 * 
	 * @param data An object with configuration options. See {@link ScryptHashInput} for avilable options.
	 * @returns	A Buffer containing the salt (first `saltLength` bytes) followed by the derived hash.
	 */
	static hash( data: ScryptHashInput )
	{
		data.length		||= Scrypt.HASH_LENGTH.default
		data.saltLength	||= Scrypt.SALT_LENGTH.default
		data.length		= Math.min( Math.max( data.length, Scrypt.HASH_LENGTH.min ), Scrypt.HASH_LENGTH.max )
		data.saltLength	= Math.min( Math.max( data.saltLength, Scrypt.SALT_LENGTH.min ), Scrypt.SALT_LENGTH.max )
		const salt		= randomBytes( data.saltLength )
		const buffer	= scryptSync( data.key, salt, data.length, data.options )

		return (
			Buffer.concat( [ salt, buffer ] )
		)

	}


	/**
	 * Compare key with hash.
	 * 
	 * @param data An object with configuration options. See {@link ScryptValidateInput} for avilable options.
	 * 
	 * @usage ```ts
	 * const password		= 'your-strong-password'
	 * const secretKey		= Scrypt.hash( { key: password, length: 16 } ) // store in database.
	 * const isValidPassword	= Scrypt.isValid( { key: password, hash: secretKey, length: 16 } )
	 * ```
	 * @returns	True if key is valid, false otherwise. Throw error if no secret or salt has been found in the hash.
	 */
	static isValid( data: ScryptValidateInput )
	{

		if ( ! data.hash ) return false
		if ( data.hash.length <= 0 ) return false

		data.length		||= Scrypt.HASH_LENGTH.default
		data.saltLength	||= Scrypt.SALT_LENGTH.default
		data.length		= Math.min( Math.max( data.length, Scrypt.HASH_LENGTH.min ), Scrypt.HASH_LENGTH.max )
		data.saltLength	= Math.min( Math.max( data.saltLength, Scrypt.SALT_LENGTH.min ), Scrypt.SALT_LENGTH.max )
		const salt		= data.hash.subarray( 0, data.saltLength )
		data.hash		= data.hash.subarray( data.saltLength )

		if ( data.hash.length !== data.length ) {
			return false
		}

		try {

			const buffer = scryptSync( data.key, salt, data.length, data.options )

			return (
				timingSafeEqual( data.hash, buffer )
			)

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch ( error ) {

			return false

		}

	}
}


export default Scrypt