import type { CoerceToUint8ArrayInput } from '@alessiofrittoli/crypto-buffer'
import { bufferEquals } from '@alessiofrittoli/crypto-buffer/common'
import type { Algo } from '@alessiofrittoli/crypto-algorithm/types'
import type stream from 'stream'
import crypto from 'crypto'

// prettier-ignore
export type HmacReturnType<T extends BufferEncoding | undefined = undefined> = (
	T extends BufferEncoding
		? string
		: Buffer
)

/**
 * Hmac Utility static class.
 *
 * Requires the following packages to be installed:
 *
 * - [`@alessiofrittoli/crypto-buffer`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer)
 * - [`@alessiofrittoli/crypto-algorithm`](https://npmjs.com/package/@alessiofrittoli/crypto-algorithm)
 */
export class Hmac {
	/**
	 * Generate Hash-based message authentication code.
	 *
	 * @param	message		The protected message.
	 * @param	secret		The secret key used for hashing.
	 * @param	algorithm	( Optional ) The algorithm used for hashing. Default: `SHA-256`.
	 * @param	options		( Optional ) Additional options.
	 *
	 * @returns	The hashed string.
	 */
	public static digest<T extends BufferEncoding | undefined = undefined>(
		message: crypto.BinaryLike,
		secret: crypto.BinaryLike | crypto.KeyObject,
		algorithm: Algo.Hash = 'SHA-256',
		encoding?: T,
		options?: stream.TransformOptions,
	): HmacReturnType<T> {
		// prettier-ignore
		const hmac = (
			crypto
				.createHmac( algorithm, secret, options )
				.update( message )
		)

		// prettier-ignore
		return (
			encoding
				? hmac.digest().toString( encoding )
				: hmac.digest()
		) as HmacReturnType<T>
	}

	/**
	 * Compare Hmac digest.
	 *
	 * @param	digest		The hmac digest.
	 * @param	message		The protected message.
	 * @param	secret		The secret key used for hashing.
	 * @param	algorithm	( Optional ) The algorithm used for hashing. Default: `SHA-256`.
	 * @param	encoding	( Optional ) The encoding used to generate the hash output.
	 * @param	options		( Optional ) Additional options.
	 *
	 * @returns	True if the given hash is valid, false otherwise.
	 */
	public static isValid(
		digest: CoerceToUint8ArrayInput,
		message: crypto.BinaryLike,
		secret: crypto.BinaryLike | crypto.KeyObject,
		algorithm?: Algo.Hash,
		encoding?: BufferEncoding,
		options?: stream.TransformOptions,
	): boolean {
		const target = Hmac.digest(message, secret, algorithm, encoding, options)

		if (typeof digest === 'string') {
			if (typeof target !== 'string') {
				throw new TypeError('You must specify the encoding used during the HMAC generation.')
			}
			return digest === target
		}

		return bufferEquals(digest, target)
	}
}
