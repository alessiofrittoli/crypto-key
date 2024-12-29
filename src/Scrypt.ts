import crypto from 'crypto'

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
export interface ScryptOptions extends crypto.ScryptOptions
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


export interface ScryptHashOptions
{
	/** The hash length. Minimum: `16`, Maximum: `256`. Default: `64`. */
	length?: number
	/** The salt length. Minimum: `16`, Maximum: `64`. Default: `32`. */
	saltLength?: number
	/** Scrypt algorithm customization options. See {@link ScryptOptions} for available options. */
	options?: ScryptOptions
}


/**
 * Scrypt Utility static class.
 * 
 */
export class Scrypt
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
	 * @param	key		The key to hash. Can be a string, Buffer, or TypedArray.
	 * @param	options	( Optional ) An object with configuration options. See {@link ScryptHashOptions} for avilable options.
	 * @returns	A Buffer containing the salt (first `saltLength` bytes) followed by the derived hash.
	 */
	static hash( key: crypto.BinaryLike, options: ScryptHashOptions = {} ): Buffer
	{
		options.length		||= Scrypt.HASH_LENGTH.default
		options.saltLength	||= Scrypt.SALT_LENGTH.default
		options.length		= Math.min( Math.max( options.length, Scrypt.HASH_LENGTH.min ), Scrypt.HASH_LENGTH.max )
		options.saltLength	= Math.min( Math.max( options.saltLength, Scrypt.SALT_LENGTH.min ), Scrypt.SALT_LENGTH.max )
		const salt			= crypto.randomBytes( options.saltLength )
		const buffer		= crypto.scryptSync( key, salt, options.length, options.options )

		return (
			Buffer.concat( [ salt, buffer ] )
		)

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
	 * const isValidPassword	= Scrypt.isValid( password, secretKey { length: 16 } )
	 * ```
	 * @returns	True if key is valid, false otherwise. Throw error if no secret or salt has been found in the hash.
	 */
	static isValid( key: crypto.BinaryLike, hash: Buffer, options: ScryptHashOptions = {} )
	{

		if ( ! hash ) return false
		if ( hash.length <= 0 ) return false

		options.length		||= Scrypt.HASH_LENGTH.default
		options.saltLength	||= Scrypt.SALT_LENGTH.default
		options.length		= Math.min( Math.max( options.length, Scrypt.HASH_LENGTH.min ), Scrypt.HASH_LENGTH.max )
		options.saltLength	= Math.min( Math.max( options.saltLength, Scrypt.SALT_LENGTH.min ), Scrypt.SALT_LENGTH.max )
		const salt			= hash.subarray( 0, options.saltLength )
		hash				= hash.subarray( options.saltLength )

		if ( hash.length !== options.length ) {
			return false
		}

		try {

			const buffer = crypto.scryptSync( key, salt, options.length, options.options )

			return (
				crypto.timingSafeEqual( hash, buffer )
			)

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch ( error ) {

			return false

		}

	}
}