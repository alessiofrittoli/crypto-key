import crypto from 'crypto'
import type stream from 'stream'
import type Algo from '@alessiofrittoli/crypto-algorithm/types'
import { bufferEquals } from '@alessiofrittoli/crypto-buffer/common'

type HmacReturnType<
	T extends BufferEncoding | undefined = undefined
> = ( T extends BufferEncoding ? string : Buffer )


/**
 * Hmac Utility static class.
 * 
 */
class Hmac
{
	/**
	 * Generate Hash-based message authentication code.
	 * 
	 * @param	message		The protected message.
	 * @param	secret		The secret key used for encryption.
	 * @param	algorithm	( Optional ) The algorithm used for encryption. Default: `SHA-256`.
	 * @param	options		( Optional ) Additional options.
	 * 
	 * @returns	The hashed string.
	 */
	static digest<T extends BufferEncoding | undefined = undefined>(
		message		: crypto.BinaryLike,
		secret		: crypto.BinaryLike | crypto.KeyObject,
		algorithm	: Algo.Hash = 'SHA-256',
		encoding?	: T,
		options?	: stream.TransformOptions,
	) {
	
		const hmac = (
			crypto
				.createHmac( algorithm, secret, options )
				.update( message )
		)
	
		return (
			encoding
				? hmac.digest().toString( encoding )
				: hmac.digest()
		) as HmacReturnType<T>
	}


	/**
	 * Compare Hmac digest.
	 * 
	 * @param	hash		The hmac digest.
	 * @param	message		The protected message.
	 * @param	secret		The secret key used for encryption.
	 * @param	algorithm	( Optional ) The algorithm used for encryption. Default: `sha256`.
	 * @param	encoding	( Optional ) The encoding used to generate the hash output.
	 * @param	options		( Optional ) Additional options.
	 * 
	 * @returns	True if the given hash is valid, false otherwise.
	 */
	static isValid<T extends BufferEncoding | undefined = undefined>(
		hash		: HmacReturnType<T>,
		message		: crypto.BinaryLike,
		secret		: crypto.BinaryLike | crypto.KeyObject,
		algorithm?	: Algo.Hash,
		encoding?	: T,
		options?	: stream.TransformOptions,
	)
	{
		const target = Hmac.digest( message, secret, algorithm, encoding, options )
		
		if ( typeof hash === 'string' ) {
			if ( typeof target !== 'string' ) {
				throw new TypeError( 'You must specify the encoding used during the HMAC generation.' )
			}
			return hash === target
		}
		if ( typeof target === 'string' ) {
			throw new TypeError( 'The compared HMAC is not of type Buffer. Please, omit the \'encoding\' parameter.' )
		}
	
		return bufferEquals( hash, target )
	}
}


export default Hmac