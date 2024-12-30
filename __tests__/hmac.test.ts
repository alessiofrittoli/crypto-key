import { Hmac } from '@/Hmac'
import type { Algo } from '@alessiofrittoli/crypto-algorithm/types'

console.log(
`
______________________________________
        __  __                    
       / / / /___ ___  ____ ______
      / /_/ / __ \`__ \\/ __ \`/ ___/
     / __  / / / / / / /_/ / /__  
    /_/ /_/_/ /_/ /_/\\__,_/\\___/  
______________________________________
`
)

const tests: ( {
	input	: string
	secret	: string
	hash	: Algo.Hash
	output	: string
} )[] = [
	{
		input	: 'message',
		secret	: 'secretkey',
		hash	: 'SHA-1',
		output	: 'd3f4f646e6f7acf66b371c915e3493776a142879',
	},
	{
		input	: 'message',
		secret	: 'secretkey',
		hash	: 'SHA-256',
		output	: '5c3e2f56de9411068f675ef32ffa12735210b9cbfee2ba521367a3955334a343',
	},
	{
		input	: 'message',
		secret	: 'secretkey',
		hash	: 'SHA-384',
		output	: 'd54bafdf42dc23789a02b049d78f5448cf9bf0fd731dcf4e369f36eaa1cbeb026a5f680c7d6b3aa5d26b7341c63d4360',
	},
	{
		input	: 'message',
		secret	: 'secretkey',
		hash	: 'SHA-512',
		output	: 'e476476c68e33079686d8473381dcdb72a377c1ff11d5cadf08e94443bc8e73094ae10c3af8f0f99971a29731ac883b595050dc8370ed0b64615417cb2e3f833',
	},
]


describe( 'Hmac.digest()', () => {

	tests.map( test => {
		it( `digests message with ${ test.hash }`, () => {
	
			expect( Hmac.digest( test.input, test.secret, test.hash, 'hex' ) )
				.toBe( test.output )
			
		} )
	} )


	it( 'supports binary input', () => {
		expect(
			Hmac.digest( Buffer.from( 'raw value' ), 'secret', undefined, 'utf-8' )
		).toBe( Hmac.digest( 'raw value', 'secret', undefined, 'utf-8' ) )
	} )

} )


describe( 'Hmac.isValid()', () => {

	tests.map( test => {
		it( `verifies hash using ${ test.hash }`, () => {
	
			expect( Hmac.isValid( test.output, test.input, test.secret, test.hash, 'hex' ) )
				.toBe( true )
			
		} )
	} )

	it( 'supports binary input', () => {
		const hash = Hmac.digest( 'raw value', 'secret' )
		expect(
			Hmac.isValid( hash, 'raw value', 'secret' )
		).toBe( true )
	} )


	it( 'supports mixed input data types', () => {
		/** base64url HMAC non-decoded Buffer. */
		const hash = (
			Buffer.from(
				Hmac.digest( 'raw value', 'secret', undefined, 'base64url' )
			)
		)

		expect( Hmac.isValid( hash, 'raw value', 'secret', undefined, 'base64url' ) )
			.toBe( true )
	} )

	
	it( 'throws a new Exception if the given hash is a string but no input encoding has been provided', () => {
		const hash = Hmac.digest( 'raw value', 'secret' ).toString( 'base64url' )
		expect(
			() => Hmac.isValid( hash, 'raw value', 'secret' )
		).toThrow( 'You must specify the encoding used during the HMAC generation.' )

	} )

} )