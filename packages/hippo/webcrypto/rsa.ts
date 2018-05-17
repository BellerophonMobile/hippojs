import { Decrypter, Encrypter, PKCipher, PKCipherer, PrivateKey,
         PublicKey } from '@bellerophon-mobile/hippo'

import { exportJWK, KEY_USAGE_CIPHERER, KEY_USAGE_DECRYPT, KEY_USAGE_ENCRYPT,
         subtle } from './subtle'

export const RSA_OAEP_2048 = 'rsa-oaep-2048'

const RSA_PARAMS: RsaOaepParams = {
  name: 'RSA-OAEP',
}

const RSA_IMPORT_PARAMS = {
  name: 'RSA-OAEP',
  hash: { name: 'SHA-256' },
}

const RSA_KEY_GEN_PARAMS = {
  name: 'RSA-OAEP',
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: { name: 'SHA-256' },
}

export class RSAEncrypter implements Encrypter {
  constructor(private readonly cryptoKey: CryptoKey) {}

  readonly algorithm = RSA_OAEP_2048

  encrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    return subtle.encrypt(RSA_PARAMS, this.cryptoKey,
      data) as Promise<ArrayBuffer>
  }

  async exportPublicKey(): Promise<PublicKey> {
    const jwk = await exportJWK(this.cryptoKey)
    return new PublicKey(this.algorithm, {
      E: jwk.e,
      N: jwk.n,
    })
  }
}

export class RSADecrypter implements Decrypter {
  constructor(private readonly cryptoKey: CryptoKey) {}

  readonly algorithm = RSA_OAEP_2048

  decrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    return subtle.decrypt(RSA_PARAMS, this.cryptoKey,
      data) as Promise<ArrayBuffer>
  }

  async exportPrivateKey(): Promise<PrivateKey> {
    const jwk = await exportJWK(this.cryptoKey)
    return new PrivateKey(this.algorithm, {
      E: jwk.e,
      D: jwk.d,
      DP: jwk.dp,
      DQ: jwk.dq,
      N: jwk.n,
      P: jwk.p,
      Q: jwk.q,
      QI: jwk.qi,
    })
  }
}

export class RSAPKCipher implements PKCipher {
  constructor(
    private readonly encrypter: RSAEncrypter,
    private readonly decrypter: RSADecrypter,
  ) {}

  readonly algorithm = RSA_OAEP_2048

  encrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    return this.encrypter.encrypt(data)
  }

  decrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
    return this.decrypter.decrypt(data)
  }

  exportPublicKey(): Promise<PublicKey> {
    return this.encrypter.exportPublicKey()
  }

  exportPrivateKey(): Promise<PrivateKey> {
    return this.decrypter.exportPrivateKey()
  }
}

export class RSAPKCipherer implements PKCipherer {
  constructor(private readonly extractable: boolean = false) {}

  readonly algorithm = RSA_OAEP_2048

  async generate(): Promise<PKCipher> {
    const keypair = await subtle.generateKey(
      RSA_KEY_GEN_PARAMS, this.extractable, KEY_USAGE_CIPHERER)

    return new RSAPKCipher(
      new RSAEncrypter(keypair.publicKey),
      new RSADecrypter(keypair.privateKey),
    )
  }

  async create(publicKey: PublicKey, privateKey: PrivateKey): Promise<PKCipher> {
    const [encrypter, decrypter] = await Promise.all([
      this.createEncrypter(publicKey),
      this.createDecrypter(privateKey),
    ])
    return new RSAPKCipher(encrypter, decrypter)
  }

  async createEncrypter(key: PublicKey): Promise<RSAEncrypter> {
    if (key.algorithm !== RSA_OAEP_2048) {
      throw new Error(`unexpected algorithm "${key.algorithm}", expected "${RSA_OAEP_2048}"`)
    }

    const jwk: JsonWebKey = {
      alg: 'RSA-OAEP-256',
      ext: this.extractable,
      key_ops: KEY_USAGE_ENCRYPT,
      kty: 'RSA',
      e: key.data.E,
      n: key.data.N,
    }

    const cryptoKey = await importJWK(jwk, this.extractable, KEY_USAGE_ENCRYPT)
    return new RSAEncrypter(cryptoKey)
  }

  async createDecrypter(key: PrivateKey): Promise<RSADecrypter> {
    if (key.algorithm !== RSA_OAEP_2048) {
      throw new Error(`unexpected algorithm "${key.algorithm}", expected "${RSA_OAEP_2048}"`)
    }

    const jwk: JsonWebKey = {
      alg: 'RSA-OAEP-256',
      ext: this.extractable,
      key_ops: KEY_USAGE_DECRYPT,
      kty: 'RSA',
      e: key.data.E,
      d: key.data.D,
      dp: key.data.DP,
      dq: key.data.DQ,
      n: key.data.N,
      p: key.data.P,
      q: key.data.Q,
      qi: key.data.QI,
    }

    const cryptoKey = await importJWK(jwk, this.extractable, KEY_USAGE_DECRYPT)
    return new RSADecrypter(cryptoKey)
  }
}

function importJWK(jwk: JsonWebKey, extractable: boolean, usages: string[]): Promise<CryptoKey> {
  const format = 'jwk'
  return subtle.importKey(format, jwk, RSA_IMPORT_PARAMS, extractable,
    usages) as Promise<CryptoKey>
}
