import crypto from 'crypto'


interface CipherOptions
{
	/** The Cipher GCM algorithm to use. Default: `aes-256-gcm`. */
	algorithm?: crypto.CipherGCMTypes
	/** The salt length. Minimum: `16`, Maximum: `64`. Default: `32`. */
	salt?: number
	/** The `IV` length. Minimum: `16`, Maximum: `32`. Default: `16`. */
	iv?: number
}


class Cipher
{
	private static SALT_LENGTH = {
		min		: 16,
		max		: 64,
		default	: 32,
	}


	private static IV_LENGTH = {
		min		: 16,
		max		: 32,
		default	: 16,
	}


	/**
	 * Encrypt data.
	 * 
	 * @param	data	The data to encrypt.
	 * @param	secret	The secret key used to encrypt the `data`.
	 * @param	options	( Optional ) Additional options.
	 * @returns	The encrypted result Buffer.
	 */
	static encrypt(
		data	: crypto.BinaryLike,
		secret	: crypto.BinaryLike,
		options	: CipherOptions = {},
	): Buffer
	{
		options.salt	||= Cipher.SALT_LENGTH.default
		options.iv	||= Cipher.IV_LENGTH.default
		options.salt	= Math.min( Math.max( options.salt, Cipher.SALT_LENGTH.min ), Cipher.SALT_LENGTH.max )
		options.iv	= Math.min( Math.max( options.iv, Cipher.IV_LENGTH.min ), Cipher.IV_LENGTH.max )

		const { keyLength, algorithm } = Cipher.getKeyLength( options.algorithm )

		const salt		= crypto.randomBytes( options.salt )
		const KEY		= crypto.scryptSync( secret, salt, keyLength )
		const IV		= crypto.randomBytes( options.iv )
		const cipher	= crypto.createCipheriv( algorithm, KEY, IV )
		const encrypted	= Buffer.concat( [ cipher.update( data ), cipher.final() ] )
		const authTag	= cipher.getAuthTag()

		return Buffer.concat( [ encrypted, IV, authTag, salt ] )
	}


	/**
	 * Decrypt data.
	 * 
	 * @param	data	The data to decrypt.
	 * @param	secret	The secret key used to decrypt the `data`.
	 * @param	options	( Optional ) Additional options. Must be the same used while encrypting data.
	 * @returns	The decrypted data Buffer.
	 */
	static decrypt(
		data	: Buffer,
		secret	: crypto.BinaryLike,
		options	: CipherOptions = {},
	): Buffer
	{
		options.salt	||= Cipher.SALT_LENGTH.default
		options.iv	||= Cipher.IV_LENGTH.default
		options.salt	= Math.min( Math.max( options.salt, Cipher.SALT_LENGTH.min ), Cipher.SALT_LENGTH.max )
		options.iv	= Math.min( Math.max( options.iv, Cipher.IV_LENGTH.min ), Cipher.IV_LENGTH.max )

		const { keyLength, algorithm } = Cipher.getKeyLength( options.algorithm )
	
		const salt = data.subarray( options.salt * -1 )
		data = data.subarray( 0, options.salt * -1 )
		const authTag = data.subarray( options.iv * -1 )
		data = data.subarray( 0, options.iv * -1 )
		const IV = data.subarray( options.iv * -1 )
		data = data.subarray( 0, options.iv * -1 )
	
		const KEY = crypto.scryptSync( secret, salt, keyLength )
	
		const decipher = (
			crypto
				.createDecipheriv( algorithm, KEY, IV )
				.setAuthTag( authTag )
		)

		return (
			Buffer.concat( [
				decipher.update( data ),
				decipher.final()
			] )
		)
	}


	/**
	 * Ensure correct key length based on the given algorithm.
	 * 
	 * @param	algorithm The AES algorithm name.
	 * @returns	An object with validated `algorithm` and `keyLength`.
	 */
	private static getKeyLength( algorithm: crypto.CipherGCMTypes = 'aes-256-gcm' )
	{
		switch ( algorithm ) {
			case 'aes-128-gcm':
				return {
					algorithm: 'aes-128-gcm',
					keyLength: 128 / 8, // AES-128 needs a 128 bit (16 bytes)
				} as const
			case 'aes-192-gcm':
				return {
					algorithm: 'aes-192-gcm',
					keyLength: 192 / 8, // AES-128 needs a 128 bit (24 bytes)
				} as const
			case 'aes-256-gcm':
			default:
				return {
					algorithm: 'aes-256-gcm',
					keyLength: 256 / 8, // AES-256 needs a 256 bit (32 bytes)
				} as const
		}
	}
}

export default Cipher