import { PrivateKey } from './keys'
import { AlgorithmFactory } from './utils/'

/**
 * An SKCipher encapsulates a secret key (symmetric) encryption algorithm,
 * parameterization, and an associated key.
 */
export interface SKCipher {
  readonly algorithm: string

  /* encrypt produces cipherdata for the given plaindata. */
  encrypt(data: ArrayBuffer): Promise<ArrayBuffer>

  /**
   * decrypt produces plaindata for the given cipherdata.
   *
   * N.B.: In general the absence of an error does NOT indicate that the data
   * is valid. A separate mechanism must be applied to assure integrity and
   * authenticity. Then note that implementing such a mechanism is not as
   * simple as signing either the plaindata or cipherdata alone.
   */
  decrypt(data: ArrayBuffer): Promise<ArrayBuffer>

  /* exportKey returns a JSON encoding of the cipher's secret key. */
  exportKey(): Promise<PrivateKey>
}

/**
 * An SKCipherer encapsulates key generation for a specific secret key
 * (symmetric) encryption algorithm and parameterization.
 */
export interface SKCipherer {
  readonly algorithm: string

  /* generate creates a new SKCipher. */
  generate(): Promise<SKCipher>

  /**
   * generateFromPassphrase creates a new SKCipher based on the given passphrase
   * and salt.
   */
  generateFromPassphrase(passphrase: string, salt: string): Promise<SKCipher>

  /* create wraps the given secret key as an SKCipher. */
  create(privateKey: PrivateKey): Promise<SKCipher>
}

/**
 * SKCiphererFactory provides methods to manage and create SKCipherer
 * implementations.
 */
export class SKCiphererFactory extends AlgorithmFactory<SKCipherer> {
  /* generate creates a new SKCipher with the given algorithm. */
  generate(algorithm: string): Promise<SKCipher> {
    return this.get(algorithm).generate()
  }

  /**
   * generateFromPassphrase creates a new SKCipher based on the given passphrase
   * and salt.
   */
  generateFromPassphrase(algorithm: string, passphrase: string, salt: string): Promise<SKCipher> {
    return this.get(algorithm).generateFromPassphrase(passphrase, salt)
  }

  /* create wraps the given secret key as a SKCipher. */
  create(privateKey: PrivateKey): Promise<SKCipher> {
    return this.get(privateKey.algorithm).create(privateKey)
  }
}
