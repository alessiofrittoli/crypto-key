import crypto from 'crypto'
import type { Algo } from '@alessiofrittoli/crypto-algorithm/types'
import { bufferEquals } from '@alessiofrittoli/crypto-buffer/common'
import type { ToDataViewInput } from '@alessiofrittoli/crypto-buffer/toDataView'

export class Hash
{
	/**
	 * Hash string.
	 * The result will be always the same with the same string.
	 * 
	 * The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform.
	 * Examples are 'sha256', 'sha512', etc.
	 * On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.
	 * 
	 * @param	string		The string to hash.
	 * @param	algorithm	( Optional ) The hash algorithm. Default: `SHA-256`.
	 * 
	 * @returns The hashed string Buffer.
	 */
	static digest(
		string		: crypto.BinaryLike,
		algorithm	: Algo.Hash | Algo.OtherHash = 'SHA-256',	
	): Buffer
	{
		return (
			crypto
				.createHash( algorithm )
				.update( string )
				.digest()
		)
	}


	/**
	 * Compare string with hash.
	 * 
	 * @param	string		The string to compare.
	 * @param	hashed		The hashed HEX string or raw Buffer.
	 * @param	algorithm	( Optional ) The algorithm used to generate the given hash. Default: `SHA-256`.
	 * 
	 * @returns	True if string matches with the hashed string, false otherwise. 
	 */
	static isValid(
		string		: string,
		hashed		: ToDataViewInput,
		algorithm	: Algo.Hash | Algo.OtherHash = 'SHA-256',	
	)
	{
		return bufferEquals( Hash.digest( string, algorithm ), hashed )
	}
}