import crypto from 'crypto'
import type { Algo } from '@alessiofrittoli/crypto-algorithm/types'
import { Hash } from '@/Hash'

const password	= 'verystrongpassword'
const hashes	= crypto.getHashes() as Algo.OtherHash[]

describe( 'Hash.digest()', () => {

	it( `hashes string with default hash algorithm`, () => {
		expect( Hash.digest( password ) )
			.toBeTruthy()
	} )


	hashes.map( algo => {
		it( `hashes string with ${ algo }`, () => {
			expect( Hash.digest( password, algo ) )
				.toBeTruthy()
		} )
	} )
	
} )


describe( 'Hash.isValid()', () => {

	it( `validates hash with default hash algorithm`, () => {
		expect( Hash.isValid( password, Hash.digest( password ) ) )
			.toBe( true )
	} )

	hashes.map( algo => {
		it( `validates hash with ${ algo }`, () => {
			expect( Hash.isValid( password, Hash.digest( password, algo ), algo ) )
				.toBe( true )
		} )
	} )

} )