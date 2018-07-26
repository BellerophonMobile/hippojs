import { PrivateKey, SKCipher, SKCipherer } from '@bellerophon-mobile/hippo'

import { concatBuffers } from './buffers'
import { exportJWK, KEY_USAGE_CIPHERER, KEY_USAGE_DERIVE,
         subtle } from './subtle'

export const AES_256_CBC = 'aes-256-cbc'
export const AES_256_GCM = 'aes-256-gcm'

export type AESAlgorithms = 'aes-256-cbc' | 'aes-256-gcm'

const AES_CBC_NAME = 'AES-CBC'
const AES_GCM_NAME = 'AES-GCM'

const CBC_STANDARD_NONCE_SIZE = 16
const GCM_STANDARD_NONCE_SIZE = 12

const PBKDF2_NAME = 'PBKDF2'
const PBKDF2_ITERATIONS = 250000
const PBKDF2_HASH = { name: 'SHA-512' }
const PBKDF2_LENGTH = 256

function nameForAlgorithm(algorithm: AESAlgorithms): string {
  switch (algorithm) {
    case AES_256_CBC:
      return AES_CBC_NAME
    case AES_256_GCM:
      return AES_GCM_NAME
    default:
      throw new Error(`unexpected algorithm ${algorithm}`)
  }
}

function ivSizeForAlgorithm(algorithm: AESAlgorithms): number {
  switch (algorithm) {
    case AES_256_CBC:
      return CBC_STANDARD_NONCE_SIZE
    case AES_256_GCM:
      return GCM_STANDARD_NONCE_SIZE
    default:
      throw new Error(`unexpected algorithm ${algorithm}`)
  }
}

export class AESSKCipher implements SKCipher {
  constructor(
    public readonly algorithm: AESAlgorithms,
    private readonly cryptoKey: CryptoKey,
  ) {}

  async encrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const params = {
      name: nameForAlgorithm(this.algorithm),
      iv: new Uint8Array(ivSizeForAlgorithm(this.algorithm)),
    }

    window.crypto.getRandomValues(params.iv)

    const cipherText = await subtle.encrypt(params, this.cryptoKey, data)

    return concatBuffers(params.iv.buffer as ArrayBuffer, cipherText)
  }

  decrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    const size = ivSizeForAlgorithm(this.algorithm)
    const iv = data.slice(0, size)
    const cipherData = data.slice(size)

    const params: AesGcmParams = {
      name: nameForAlgorithm(this.algorithm),
      iv,
    }

    return subtle.decrypt(params, this.cryptoKey,
      cipherData) as Promise<ArrayBuffer>
  }

  async exportKey(): Promise<PrivateKey> {
    const jwk = await exportJWK(this.cryptoKey)
    return new PrivateKey(this.algorithm, jwk.k)
  }
}

export class AESSKCipherer implements SKCipherer {
  constructor(
    public readonly algorithm: AESAlgorithms,
    private readonly extractable: boolean = false,
  ) {}

  async generate(): Promise<SKCipher> {
    const params = {
      name: nameForAlgorithm(this.algorithm),
      length: 256,
    }

    const key = await subtle.generateKey(params, this.extractable, KEY_USAGE_CIPHERER)
    return new AESSKCipher(this.algorithm, key)
  }

  async generateFromPassphrase(passphrase: string, salt: string): Promise<SKCipher> {
    const encoder = new TextEncoder()

    const rawBuf = encoder.encode(passphrase)

    const format = 'raw'
    // KDF keys must set extractable=false
    const extractable = false
    const rawKey = await subtle.importKey(
      format, rawBuf, PBKDF2_NAME, extractable, KEY_USAGE_DERIVE)

    const saltBuf = encoder.encode(salt)

    const params = {
      name: PBKDF2_NAME,
      salt: saltBuf,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    }

    const derivedParams = {
      name: nameForAlgorithm(this.algorithm),
      length: PBKDF2_LENGTH,
    }

    const key = await subtle.deriveKey(
      params, rawKey, derivedParams, this.extractable, KEY_USAGE_CIPHERER)

    return new AESSKCipher(this.algorithm, key)
  }

  async create(key: PrivateKey): Promise<SKCipher> {
    let alg: string
    let name: string

    switch (key.algorithm) {
      case AES_256_CBC:
        alg = 'A256CBC'
        name = AES_CBC_NAME
        break

      case AES_256_GCM:
        alg = 'A256GCM'
        name = AES_GCM_NAME
        break

      default:
        throw new Error(`unexpected algorithm "${key.algorithm}"`)
    }

    const jwk: JsonWebKey = {
      alg,
      ext: this.extractable,
      key_ops: KEY_USAGE_CIPHERER,
      kty: 'oct',
      k: key.data,
    }

    const format = 'jwk'
    const cryptoKey = await subtle.importKey(
      format, jwk, name, this.extractable, KEY_USAGE_CIPHERER)

    return new AESSKCipher(this.algorithm, cryptoKey)
  }
}
