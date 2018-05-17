import { Inject, Injectable, Optional } from '@angular/core'

import { Decrypter, Encrypter, PKCipher, PKCiphererFactory, PrivateKey,
         PublicKey } from '@bellerophon-mobile/hippo'
import { RSAPKCipherer } from '@bellerophon-mobile/hippo/webcrypto'

import { ExtractableToken } from './extractable.token'

/**
 * PKCipherService provides methods to manage and create PKCipherer
 * implementations.
 */
@Injectable({
  providedIn: 'root',
})
export class PKCipherService {
  constructor(@Optional() @Inject(ExtractableToken) extractable?: boolean) {
    this.factory.add(new RSAPKCipherer(!!extractable))
  }

  private readonly factory = new PKCiphererFactory()

  /* generate creates a new PKCipher with the given algorithm. */
  generate(algorithm: string): Promise<PKCipher> {
    return this.factory.generate(algorithm)
  }

  /* create wraps the given keys as a PKCipher. */
  create(publicKey: PublicKey, privateKey: PrivateKey): Promise<PKCipher> {
    return this.factory.create(publicKey, privateKey)
  }

  /* createEncrypter wraps the given PublicKey as an Encrypter. */
  createEncrypter(publicKey: PublicKey): Promise<Encrypter> {
    return this.factory.createEncrypter(publicKey)
  }

  /* createDecrypter wraps the given PrivateKey as a Decrypter. */
  createDecrypter(privateKey: PrivateKey): Promise<Decrypter> {
    return this.factory.createDecrypter(privateKey)
  }

}
