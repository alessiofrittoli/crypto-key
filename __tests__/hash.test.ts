import crypto from 'crypto'
import type Algo from '@alessiofrittoli/crypto-algorithm/types'
import Hash from '@/Hash'

const password	= 'verystrongpassword'
const hashes	= crypto.getHashes() as Algo.OtherHash[]

describe( 'Hash.digest()', () => {

	hashes.map( algo => {
		it( `hashes string with ${ algo }`, () => {
			expect( Hash.digest( password, algo ) )
				.toBeTruthy()
		} )
	} )
	
} )


describe( 'Hash.isValid()', () => {

	hashes.map( algo => {
		it( `validates hash with ${ algo }`, () => {
			expect( Hash.isValid( password, Hash.digest( password, algo ), algo ) )
				.toBe( true )
		} )
	} )

} )