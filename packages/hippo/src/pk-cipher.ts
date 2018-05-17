import { PrivateKey, PublicKey } from './keys'
import { AlgorithmFactory } from './utils/'

/* Encryptor wraps a public key and encrypts data. */
export interface Encrypter {
  readonly algorithm: string

  /* encrypt produces cipherdata for the given plaindata. */
  encrypt(data: ArrayBuffer): Promise<ArrayBuffer>

  /* exportPublicKey returns a JSON encoding of the cipher's public key. */
  exportPublicKey(): Promise<PublicKey>
}

export interface Decrypter {
  readonly algorithm: string

  /**
   * decrypt produces plaindata for the given cipherdata.
   *
   * N.B.: In general the absence of an error does NOT indicate that the data
   * is valid. A separate mechanism must be applied to assure integrity and
   * authenticity. Then note that implementing such a mechanism is not as
   * simple as signing either the plaindata or cipherdata alone.
   */
  decrypt(data: ArrayBuffer): Promise<ArrayBuffer>

  /* exportPrivateKey returns a JSON encoding of the cipher's private key. */
  exportPrivateKey(): Promise<PrivateKey>
}

/**
 * PKCipher encapsulates a public key (asymmetric) encryption algorithm,
 * parameterization, and matched keys to encrypt and decrypt data.
 */
export interface PKCipher extends Encrypter, Decrypter {}

/**
 * A PKCipherer encapsulates key generation for a specific public key
 * encryption algorithm and parameterization.
 */
export interface PKCipherer {
  readonly algorithm: string

  /* generate creates a new PKCipher. */
  generate(): Promise<PKCipher>

  /* create wraps the given keys as a PKCipher. */
  create(publicKey: PublicKey, privateKey: PrivateKey): Promise<PKCipher>

  /* createEncrypter wraps the given PublicKey as an Encrypter. */
  createEncrypter(publicKey: PublicKey): Promise<Encrypter>

  /* createDecrypter wraps the given PrivateKey as a Decrypter. */
  createDecrypter(privateKey: PrivateKey): Promise<Decrypter>
}

/**
 * PKCiphererFactory provides methods to manage and create PKCipherer
 * implementations.
 */
export class PKCiphererFactory extends AlgorithmFactory<PKCipherer> {
  /* generate creates a new PKCipher with the given algorithm. */
  generate(algorithm: string): Promise<PKCipher> {
    return this.get(algorithm).generate()
  }

  /* create wraps the given keys as a PKCipher. */
  create(publicKey: PublicKey, privateKey: PrivateKey): Promise<PKCipher> {
    AlgorithmFactory.algorithmsMatch(publicKey, privateKey)
    return this.get(publicKey.algorithm).create(publicKey, privateKey)
  }

  /* createEncrypter wraps the given PublicKey as an Encrypter. */
  createEncrypter(publicKey: PublicKey): Promise<Encrypter> {
    return this.get(publicKey.algorithm).createEncrypter(publicKey)
  }

  /* createDecrypter wraps the given PrivateKey as a Decrypter. */
  createDecrypter(privateKey: PrivateKey): Promise<Decrypter> {
    return this.get(privateKey.algorithm).createDecrypter(privateKey)
  }
}
