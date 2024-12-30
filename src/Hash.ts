import crypto from 'crypto'
import type { Algo } from '@alessiofrittoli/crypto-algorithm/types'
import { bufferEquals } from '@alessiofrittoli/crypto-buffer/common'
import type { CoerceToUint8ArrayInput } from '@alessiofrittoli/crypto-buffer'

export class Hash
{
	/**
	 * Generates a cryptographic hash of the given input using the specified algorithm.
	 *
	 * @param input - The data to be hashed. This can be a string, Buffer, TypedArray, or DataView.
	 * @param algorithm - The hash algorithm to use. Defaults to 'SHA-256'. Can be any valid hash algorithm supported by the crypto module (you can use `crypto.getHashes()` to get the list of supported hashes).
	 * @returns A Buffer containing the resulting hash.
	 */
	static digest(
		input		: crypto.BinaryLike,
		algorithm	: Algo.Hash | Algo.OtherHash = 'SHA-256',	
	): Buffer
	{
		return (
			crypto
				.createHash( algorithm )
				.update( input )
				.digest()
		)
	}


	/**
	 * Validates if the given input, when hashed with the specified algorithm, matches the provided hashed value.
	 *
	 * @param input - The raw input data.
	 * @param digest - The hash digest value to compare against.
	 * @param algorithm - The hash algorithm previously used while generating the `hashed` data. Defaults to 'SHA-256'.
	 * @returns A boolean indicating whether the hashed input matches the provided hashed value.
	 */
	static isValid(
		input		: crypto.BinaryLike,
		digest		: CoerceToUint8ArrayInput,
		algorithm	: Algo.Hash | Algo.OtherHash = 'SHA-256',	
	)
	{
		return bufferEquals( Hash.digest( input, algorithm ), digest )
	}
}