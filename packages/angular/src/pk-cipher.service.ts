import { Injectable } from '@angular/core'

import {
  Decrypter, Encrypter, PKCipher, PrivateKey, PublicKey,
} from '@bellerophon-mobile/hippo'

/**
 * PKCipherService provides methods to manage and create PKCipherer
 * implementations.
 */
@Injectable({ providedIn: 'root' })
export class PKCipherService {
  /* generate creates a new PKCipher with the given algorithm. */
  generate(_algorithm: string): Promise<PKCipher> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* create wraps the given keys as a PKCipher. */
  create(_publicKey: PublicKey, _privateKey: PrivateKey): Promise<PKCipher> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* createEncrypter wraps the given PublicKey as an Encrypter. */
  createEncrypter(_publicKey: PublicKey): Promise<Encrypter> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* createDecrypter wraps the given PrivateKey as a Decrypter. */
  createDecrypter(_privateKey: PrivateKey): Promise<Decrypter> {
    throw new Error('not implemented, import WebCrytpo module')
  }
}
