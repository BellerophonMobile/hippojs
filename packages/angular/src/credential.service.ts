import { Injectable } from '@angular/core'

import {
  Credentials, PrivateKey, PublicKey, Signer, Verifier,
} from '@bellerophon-mobile/hippo'

/**
 * CredentialerService provides methods to manage and create Credentialer
 * implementations.
 */
@Injectable({ providedIn: 'root' })
export class CredentialService {
  /* generate creates a new set of credentials with the given algorithm. */
  generate(_algorithm: string): Promise<Credentials> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* create wraps the given keys as a Credentials. */
  create(_publicKey: PublicKey, _privateKey: PrivateKey): Promise<Credentials> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* createSigner wraps the given private key as a Signer. */
  createSigner(_privateKey: PrivateKey): Promise<Signer> {
    throw new Error('not implemented, import WebCrytpo module')
  }

  /* createVerifier wraps the given public key as a Verifier. */
  createVerifier(_publicKey: PublicKey): Promise<Verifier> {
    throw new Error('not implemented, import WebCrytpo module')
  }
}
