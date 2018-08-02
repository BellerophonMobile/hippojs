import { Inject, Injectable, Optional } from '@angular/core'

import {
  CredentialerFactory, Credentials, PrivateKey, PublicKey, Signer, Verifier,
} from '@bellerophon-mobile/hippo'
import { ECDSACredentialer } from '@bellerophon-mobile/hippo/webcrypto'

import { ExtractableToken } from './extractable.token'

/**
 * CredentialerService provides methods to manage and create Credentialer
 * implementations.
 */
@Injectable({ providedIn: 'root' })
export class WebCryptoCredentialService {
  constructor(@Optional() @Inject(ExtractableToken) extractable?: boolean) {
    this.factory.add(new ECDSACredentialer(!!extractable))
  }

  private readonly factory = new CredentialerFactory()

  /* generate creates a new set of credentials with the given algorithm. */
  generate(algorithm: string): Promise<Credentials> {
    return this.factory.generate(algorithm)
  }

  /* create wraps the given keys as a Credentials. */
  create(publicKey: PublicKey, privateKey: PrivateKey): Promise<Credentials> {
    return this.factory.create(publicKey, privateKey)
  }

  /* createSigner wraps the given private key as a Signer. */
  createSigner(privateKey: PrivateKey): Promise<Signer> {
    return this.factory.createSigner(privateKey)
  }

  /* createVerifier wraps the given public key as a Verifier. */
  createVerifier(publicKey: PublicKey): Promise<Verifier> {
    return this.factory.createVerifier(publicKey)
  }
}
