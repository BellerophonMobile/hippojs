import { validateTypes } from './utils/'

/* PublicKeyJSON is the canonical JSON serialization of a PublicKey. */
export interface PublicKeyJSON {
  readonly Algorithm: string
  readonly Public: any
}

/* PrivateKeyJSON is the canonical JSON serialization of a PrivateKey. */
export interface PrivateKeyJSON {
  readonly Algorithm: string
  readonly Private: any
}

/**
 * PublicKey is a structure for importing and exporting public keys.
 *
 * Verification is actually done with Credentials or a Verifier. Decryption is
 * actually done with a Cipher or a Decrypter. The format of the data is
 * defined by the algorithm implementation but should be generic JSON such that
 * it may be parsed directly, i.e., without special knowledge of the value of
 * Public as might be necessary to instantiate a specific class, etc..
 */
export class PublicKey {
  constructor(
    public readonly algorithm: string,
    public readonly data: any,
  ) {}

  /* fromJSON parses a public key from the given JSON representation. */
  static fromJSON(data: PublicKeyJSON): PublicKey {
    validateTypes(data, {
      Algorithm: 'string',
      Public: 'defined',
    })

    return new PublicKey(data.Algorithm, data.Public)
  }

  /* toJSON serializes this public key to a JSON representation. */
  toJSON(): PublicKeyJSON {
    return {
      Algorithm: this.algorithm,
      Public: this.data,
    }
  }
}

/**
 * PrivateKey is a structure for importing and exporting private keys. Signing
 * is actually done with Credentials or a Signer. Encryption is done with a
 * Cipher or an Encrypter. The format of the data is defined by the algorithm
 * implementation but should be generic JSON such that it may be parsed
 * directly, i.e., without special knowledge of the value of Private as might
 * be necessary to instantiate a specific class, etc..
 */
export class PrivateKey {
  constructor(
    public readonly algorithm: string,
    public readonly data: any,
  ) {}

  /* fromJSON parses a private key from the given JSON representation. */
  static fromJSON(data: PrivateKeyJSON): PrivateKey {
    validateTypes(data, {
      Algorithm: 'string',
      Private: 'defined',
    })

    return new PrivateKey(data.Algorithm, data.Private)
  }

  /* toJSON serializes this private key to a JSON representation. */
  toJSON(): PrivateKeyJSON {
    return {
      Algorithm: this.algorithm,
      Private: this.data,
    }
  }
}
