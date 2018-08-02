import { inject, TestBed } from '@angular/core/testing'

import { PrivateKey } from '@bellerophon-mobile/hippo'
import { AESSKCipher } from '@bellerophon-mobile/hippo/webcrypto'

import { ExtractableToken } from './extractable.token'
import { WebCryptoSKCipherService } from './sk-cipher.service'

const testCBCKey = new PrivateKey('aes-256-cbc', 'FbVNOra6lvpnAeqyHO-sllTJiFGBe0YjiqyNvqTChPg')
const testGCMKey = new PrivateKey('aes-256-gcm', 'FbVNOra6lvpnAeqyHO-sllTJiFGBe0YjiqyNvqTChPg')

describe('WebCryptoSKCipherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ExtractableToken, useValue: true },
        WebCryptoSKCipherService,
      ],
    })
  })

  let service: WebCryptoSKCipherService

  beforeEach(inject([WebCryptoSKCipherService], (s: WebCryptoSKCipherService) => service = s))

  it('should be created', () => {
    expect(service instanceof WebCryptoSKCipherService).toBeTruthy()
  })

  it('should generate an AES-256-CBC cipher', async () => {
    const cipher = await service.generate('aes-256-cbc')
    expect(cipher instanceof AESSKCipher).toBeTruthy()
  })

  it('should generate an AES-256-GCM cipher', async () => {
    const cipher = await service.generate('aes-256-gcm')
    expect(cipher instanceof AESSKCipher).toBeTruthy()
  })

  it('should generate a AES-256-CBC cipher from a passphrase', async () => {
    const cipher = await service.generateFromPassphrase(
      'aes-256-cbc', 'passphrase', 'salt')
    const key = await cipher.exportKey()

    expect(key).toEqual(testCBCKey)
  })

  it('should generate a AES-256-GCM cipher from a passphrase', async () => {
    const cipher = await service.generateFromPassphrase(
      'aes-256-gcm', 'passphrase', 'salt')
    const key = await cipher.exportKey()

    expect(key).toEqual(testGCMKey)
  })

  it('should wrap a AES-256-CBC secret key', async () => {
    const cipher = await service.create(testCBCKey)
    const key = await cipher.exportKey()

    expect(key).toEqual(testCBCKey)
  })

  it('should wrap a AES-256-GCM secret key', async () => {
    const cipher = await service.create(testGCMKey)
    const key = await cipher.exportKey()

    expect(key).toEqual(testGCMKey)
  })

})
