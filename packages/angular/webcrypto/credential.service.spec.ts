import { inject, TestBed } from '@angular/core/testing'

import { PrivateKey, PublicKey } from '@bellerophon-mobile/hippo'
import { ECDSACredentials } from '@bellerophon-mobile/hippo/webcrypto'

import { WebCryptoCredentialService } from './credential.service'
import { EXTRACTABLE } from './extractable.token'

const testPublicKey = new PublicKey('ecdsa-p256', {
  X: 'pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY',
  Y: 'ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw',
})

const testPrivateKey = new PrivateKey('ecdsa-p256', {
  D: 'BqzIKJzD59Ft1AmnSvFJJ_fWvyNeTQH78qtD9dPWamM',
  X: 'pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY',
  Y: 'ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw',
})

describe('WebCryptoCredentialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EXTRACTABLE, useValue: true },
        WebCryptoCredentialService,
      ],
    })
  })

  let service: WebCryptoCredentialService

  beforeEach(inject([WebCryptoCredentialService], (s: WebCryptoCredentialService) => service = s))

  it('should be created', () => {
    expect(service instanceof WebCryptoCredentialService).toBeTruthy()
  })

  it('should generate ECDSA-P256 credentials', async () => {
    const credentials = await service.generate('ecdsa-p256')
    expect(credentials instanceof ECDSACredentials).toBeTruthy()
  })

  it('should fail with an invalid algorithm', async () => {
    try {
      await service.generate('invalid')
      fail('service should throw')
    } catch (err) {
      expect(err instanceof Error).toBeTruthy()
    }
  })

  it('should wrap public/private keys', async () => {
    const credentials = await service.create(testPublicKey, testPrivateKey)
    const publicKey = await credentials.exportPublicKey()
    const privateKey = await credentials.exportPrivateKey()

    expect(publicKey).toEqual(testPublicKey)
    expect(privateKey).toEqual(testPrivateKey)
  })

  it('should wrap a private key', async () => {
    const signer = await service.createSigner(testPrivateKey)
    const privateKey = await signer.exportPrivateKey()

    expect(privateKey).toEqual(testPrivateKey)
  })

  it('should wrap a public key', async () => {
    const verifier = await service.createVerifier(testPublicKey)
    const publicKey = await verifier.exportPublicKey()

    expect(publicKey).toEqual(testPublicKey)
  })
})
