import { Inject, Injectable, Optional } from '@angular/core'

import {
  AES_256_CBC, AES_256_GCM, PrivateKey, SKCipher, SKCiphererFactory,
} from '@bellerophon-mobile/hippo'
import { AESSKCipherer } from '@bellerophon-mobile/hippo/webcrypto'

import { EXTRACTABLE } from './extractable.token'

/**
 * SKCiphererService provides methods to manage and create SKCipherer
 * implementations.
 */
@Injectable({ providedIn: 'root' })
export class WebCryptoSKCipherService {
  constructor(@Optional() @Inject(EXTRACTABLE) extractable?: boolean) {
    this.factory.add(new AESSKCipherer(AES_256_CBC, !!extractable))
    this.factory.add(new AESSKCipherer(AES_256_GCM, !!extractable))
  }

  private readonly factory = new SKCiphererFactory()

  /* generate creates a new SKCipher with the given algorithm. */
  generate(algorithm: string): Promise<SKCipher> {
    return this.factory.generate(algorithm)
  }

  /**
   * generateFromPassphrase creates a new SKCipher based on the given passphrase
   * and salt.
   */
  generateFromPassphrase(algorithm: string, passphrase: string, salt: string): Promise<SKCipher> {
    return this.factory.generateFromPassphrase(algorithm, passphrase, salt)
  }

  /* create wraps the given secret key as a SKCipher. */
  create(privateKey: PrivateKey): Promise<SKCipher> {
    return this.factory.create(privateKey)
  }
}
