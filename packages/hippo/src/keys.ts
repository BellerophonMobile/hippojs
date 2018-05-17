import { validateTypes } from './utils/'

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

  /* fromJSON parses a public key from the given JSON string. */
  static fromJSON(json: string): PublicKey {
    const key = JSON.parse(json)
    validateTypes(key, {
      Algorithm: 'string',
      Public: 'object',
    })

    return new PublicKey(key.Algorithm, key.Public)
  }

  /* toJSON serializes this public key to a JSON string. */
  toJSON(): string {
    return JSON.stringify({
      Algorithm: this.algorithm,
      Public: this.data,
    })
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

  /* fromJSON parses a private key from the given JSON string. */
  static fromJSON(json: string): PrivateKey {
    const key = JSON.parse(json)
    validateTypes(key, {
      Algorithm: 'string',
      Private: 'object',
    })

    return new PrivateKey(key.Algorithm, key.Private)
  }

  /* toJSON serializes this private key to a JSON string. */
  toJSON(): string {
    return JSON.stringify({
      Algorithm: this.algorithm,
      Private: this.data,
    })
  }
}
