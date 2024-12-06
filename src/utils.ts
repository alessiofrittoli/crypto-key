import crypto from 'crypto'

/**
 * Generate random key.
 * 
 * @param bytes		( Optional ) The number of bytes to generate. Default: `64`.
 * @param encoding	( Optional ) The string encoding. Default: `hex`.
 * 
 * @returns	A random key.
 */
export const generateKey = ( bytes = 64, encoding: BufferEncoding = 'hex' ) => (
	crypto
		.randomBytes( bytes )
		.toString( encoding )
)