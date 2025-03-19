import { Scrypt, type ScryptOptions } from '@/Scrypt'

console.log(
`
__________________________________________
       _____                       __ 
      / ___/____________  ______  / /_
      \\__ \\/ ___/ ___/ / / / __ \\/ __/
     ___/ / /__/ /  / /_/ / /_/ / /_  
    /____/\\___/_/   \\__, / .___/\\__/  
                   /____/_/           
__________________________________________
`
)

const password = 'verystrongpassword'
const options: ScryptOptions = {
	cost			: 8192 * 2,
	parallelization	: 4,
	blockSize		: 1,
	maxmem			: 32 * 1024 * 1024,
}

describe( 'Scrypt.hash()', () => {

	it( 'hashes a string', () => {
		expect( Scrypt.hash( password ) )
			.toBeTruthy()
	} )


	it( 'always returns a unique hash', () => {
		const hash1	= Scrypt.hash( password )
		const hash2	= Scrypt.hash( password )

		expect( hash1 === hash2 )
			.not.toBe( true )
	} )


	it( 'allows hash length customization', () => {
		expect( Scrypt.hash( password, { length: 16 } ).length )
			.toBe( 48 )
	} )


	it( 'allows salt length customization', () => {
		expect( Scrypt.hash( password, { length: 16, saltLength: 16 } ).length )
			.toBe( 32 )
	} )


	it( 'allows algorithm customization', () => {
		expect( Scrypt.hash( password, { length: 16, saltLength: 16, options } ).length )
			.toBe( 32 )
	} )

} )


describe( 'Scrypt.isValid()', () => {

	it( 'validates a Scrpyt hash', () => {
		expect( Scrypt.isValid( password, Scrypt.hash( password ) ) )
			.toBe( true )
		expect( Scrypt.isValid( 'wrong password', Scrypt.hash( password ) ) )
			.toBe( false )
	} )


	it( 'validates a Scrpyt hash with custom options', () => {
		expect( Scrypt.isValid( password, Scrypt.hash( password, { options } ), { options } ) )
			.toBe( true )
		expect( Scrypt.isValid( 'wrong password', Scrypt.hash( password, { options } ), { options } ) )
			.toBe( false )
	} )
	
	
	it( 'returns `false` if an error occurs during validation', () => {
		//@ts-expect-error negative testing unexpected input (2342)
		expect( Scrypt.isValid( 2343, Scrypt.hash( password, { options } ), { options } ) )
			.toBe( false )
	} )


	it( 'returns `false` if no hash or empty hash is provided', () => {
		// @ts-expect-error negative testing
		expect( Scrypt.isValid( password, undefined ) )
			.toBe( false )
		expect( Scrypt.isValid( password, Buffer.from( [] ) ) )
			.toBe( false )
	} )


	it( 'returns `false` hash length is differente then the length provided in the options', () => {
		expect( Scrypt.isValid( password, Buffer.from( [ 1, 2, 3 ] ), { length: 2 } ) )
			.toBe( false )
	} )


	it( 'returns `false` if an error occurs during validation', () => {
		// @ts-expect-error negative testing
		expect( Scrypt.isValid( {}, {} ) )
			.toBe( false )
	} )
	

} )