import { PrivateKey, PublicKey } from './keys'
import { AlgorithmFactory } from './utils/'

/* Signer wraps a private key and can sign. */
export interface Signer {
  readonly algorithm: string

  /* sign produces a signature for the given data. */
  sign(data: ArrayBuffer): Promise<ArrayBuffer>

  /* exportPrivateKey returns a JSON encoding of the signer's private key. */
  exportPrivateKey(): Promise<PrivateKey>
}

/* Verifier wraps a public key and can verify data. */
export interface Verifier {
  readonly algorithm: string

  /**
   * verify confirms that the given signature was produced from the given data
   * using the private key associated with this verifier's public key.
   */
  verify(data: ArrayBuffer, signature: ArrayBuffer): Promise<boolean>

  /* exportPrivateKey returns a JSON encoding of the verifiers's public key. */
  exportPublicKey(): Promise<PublicKey>
}

/* Credentials contain matched keys to both sign and verify data. */
export interface Credentials extends Signer, Verifier {}

/**
 * Credentialer encapsulates key generation for a specific digital signature
 * algorithm and parameterization.
 */
export interface Credentialer {
  readonly algorithm: string

  /* generate creates a new set of credentials. */
  generate(): Promise<Credentials>

  /* create wraps the given keys as a Credentials. */
  create(publicKey: PublicKey, privateKey: PrivateKey): Promise<Credentials>

  /* createSigner wraps the given private key as a Signer. */
  createSigner(privateKey: PrivateKey): Promise<Signer>

  /* createVerifier wraps the given public key as a Verifier. */
  createVerifier(publicKey: PublicKey): Promise<Verifier>
}

/**
 * CredentialerFactory provides methods to manage and create Credentialer
 * implementations.
 */
export class CredentialerFactory extends AlgorithmFactory<Credentialer> {
  /* Creates a new factory with the given Credentialers */
  constructor(...credentialers: Credentialer[]) {
    super(...credentialers)
  }

  /* generate creates a new set of credentials with the given algorithm. */
  generate(algorithm: string): Promise<Credentials> {
    return this.get(algorithm).generate()
  }

  /* create wraps the given keys as a Credentials. */
  create(publicKey: PublicKey, privateKey: PrivateKey): Promise<Credentials> {
    AlgorithmFactory.algorithmsMatch(publicKey, privateKey)
    return this.get(publicKey.algorithm).create(publicKey, privateKey)
  }

  /* createSigner wraps the given private key as a Signer. */
  createSigner(privateKey: PrivateKey): Promise<Signer> {
    return this.get(privateKey.algorithm).createSigner(privateKey)
  }

  /* createVerifier wraps the given public key as a Verifier. */
  createVerifier(publicKey: PublicKey): Promise<Verifier> {
    return this.get(publicKey.algorithm).createVerifier(publicKey)
  }
}
