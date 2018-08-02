import { Injectable } from '@angular/core'

import {
  PrivateKey, SKCipher,
} from '@bellerophon-mobile/hippo'

/**
 * SKCiphererService provides methods to manage and create SKCipherer
 * implementations.
 */
@Injectable({ providedIn: 'root' })
export class SKCipherService {
  /* generate creates a new SKCipher with the given algorithm. */
  generate(_algorithm: string): Promise<SKCipher> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /*
   * generateFromPassphrase creates a new SKCipher based on the given passphrase
   * and salt.
   */
  generateFromPassphrase(_algorithm: string, _passphrase: string, _salt: string): Promise<SKCipher> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* create wraps the given secret key as a SKCipher. */
  create(_privateKey: PrivateKey): Promise<SKCipher> {
    throw new Error('not implemented, import WebCrytpo module')
  }
}
