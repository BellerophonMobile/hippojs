import { PrivateKey, PublicKey } from './keys'

// tslint:disable:max-line-length
const testPublicKeyJSON = `{"Algorithm":"ecdsa-p256","Public":{"X":"pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY","Y":"ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw"}}`
const testPrivateKeyJSON = `{"Algorithm":"ecdsa-p256","Private":{"D":"BqzIKJzD59Ft1AmnSvFJJ_fWvyNeTQH78qtD9dPWamM","X":"pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY","Y":"ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw"}}`
// tslint:enable:max-line-length

const testPublicKey = new PublicKey('ecdsa-p256', {
  X: 'pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY',
  Y: 'ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw',
})

const testPrivateKey = new PrivateKey('ecdsa-p256', {
  D: 'BqzIKJzD59Ft1AmnSvFJJ_fWvyNeTQH78qtD9dPWamM',
  X: 'pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY',
  Y: 'ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw',
})

describe('PublicKey', () => {
  it('should parse JSON', () => {
    const key = PublicKey.fromJSON(JSON.parse(testPublicKeyJSON))
    expect(key).toEqual(testPublicKey)
  })

  it('should serialize to JSON', () => {
    const json = JSON.stringify(testPublicKey.toJSON())
    expect(json).toEqual(testPublicKeyJSON)
  })
})

describe('PrivateKey', () => {
  it('should parse JSON', () => {
    const key = PrivateKey.fromJSON(JSON.parse(testPrivateKeyJSON))
    expect(key).toEqual(testPrivateKey)
  })

  it('should serialize to JSON', () => {
    const json = JSON.stringify(testPrivateKey.toJSON())
    expect(json).toEqual(testPrivateKeyJSON)
  })
})
