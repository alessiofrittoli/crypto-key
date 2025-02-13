import { Cipher } from '@/Cipher'
import { bufferEquals } from '@alessiofrittoli/crypto-buffer/common'

console.log(
`
________________________________________
       _______       __             
      / ____(_)___  / /_  ___  _____
     / /   / / __ \\/ __ \\/ _ \\/ ___/
    / /___/ / /_/ / / / /  __/ /    
    \\____/_/ .___/_/ /_/\\___/_/     
          /_/                       
________________________________________
`
)


const dataToEncrypt	= 'my TOP-SECRET message'
const password		= 'verystrong-password'



describe( 'Cipher.encrypt()', () => {

	it( 'encrypts data', () => {
		expect( Cipher.encrypt( dataToEncrypt, password ) )
			.toBeInstanceOf( Buffer )
	} )
	
	
	it( 'encrypts data with custom `aes-128-gcm` algorithm', () => {
		expect( Cipher.encrypt( dataToEncrypt, password, { algorithm: 'aes-128-gcm' } ) )
			.toBeInstanceOf( Buffer )
	} )


	it( 'encrypts data with custom `aes-192-gcm` algorithm', () => {
		expect( Cipher.encrypt( dataToEncrypt, password, { algorithm: 'aes-192-gcm' } ) )
			.toBeInstanceOf( Buffer )
	} )


	it( 'encrypts data with custom `aes-256-gcm` algorithm', () => {
		expect( Cipher.encrypt( dataToEncrypt, password, { algorithm: 'aes-256-gcm' } ) )
			.toBeInstanceOf( Buffer )
	} )


	it( 'encrypts data with custom salt length', () => {
		expect( Cipher.encrypt( dataToEncrypt, password, { salt: 64 } ).length )
			.toBe( 117 )
	} )


	it( 'encrypts data with custom salt length', () => {
		expect( Cipher.encrypt( dataToEncrypt, password, { iv: 32 } ).length )
			.toBe( 101 )
	} )


	it( 'always produce a unique result', () => {
		const encrypted1 = Cipher.encrypt( dataToEncrypt, password )
		const encrypted2 = Cipher.encrypt( dataToEncrypt, password )
		
		expect( bufferEquals( encrypted1, encrypted2 ) )
			.toBe( false )
	} )

} )


describe( 'Cipher.decrypt()', () => {

	it( 'decrypts data', () => {
		const encrypted = Cipher.encrypt( dataToEncrypt, password )
		expect( Cipher.decrypt( encrypted, password ).toString() )
			.toBe( dataToEncrypt )
	} )

} )