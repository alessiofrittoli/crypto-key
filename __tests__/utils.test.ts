import { generateKey } from '@/utils'

describe( 'generateKey', () => {

	it( 'generates a key with the default length and encoding', () => {

		const key = generateKey()
		expect( key ).toHaveLength( 64 * 2 ) // 64 bytes in hex encoding results in 128 characters
		expect( typeof key ).toBe( 'string' )

	} )


	it( 'generates a key with the specified number of bytes', () => {

		const key = generateKey( 32 ) // 32 bytes
		expect( key ).toHaveLength( 32 * 2 ) // 32 bytes in hex encoding results in 64 characters

	} )


	it( 'generates a key with the specified encoding', () => {
		const key = generateKey( 16, 'base64' ) // 16 bytes in base64 encoding
		expect( typeof key ).toBe( 'string' )
		expect( key ).toMatch( /^[A-Za-z0-9+/]+={0,2}$/ ) // Base64 regex
	} )


	it( 'throws an error if an invalid encoding is provided', () => {
		expect( () => (
			generateKey( 64, 'invalid-encoding' as BufferEncoding )
		) ).toThrow()
	} )

} )