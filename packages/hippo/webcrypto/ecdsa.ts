import { Credentialer, Credentials, PrivateKey, PublicKey, Signer,
         Verifier } from '@bellerophon-mobile/hippo'

import { exportJWK, KEY_USAGE_CREDENTIALER, KEY_USAGE_SIGN, KEY_USAGE_VERIFY,
         subtle} from './subtle'

/* Algorithm identifier for ECDSA-P256. */
export const ECDSA_P256 = 'ecdsa-p256'

const ECDSA_KEY_GEN_PARAMS: EcKeyGenParams = {
  name: 'ECDSA',
  namedCurve: 'P-256',
}

const ECDSA_PARAMS: EcdsaParams = {
  name: 'ECDSA',
  hash: { name: 'SHA-256' },
}

export class ECDSASigner implements Signer {
  constructor(private readonly cryptoKey: CryptoKey) {}

  readonly algorithm = ECDSA_P256

  sign(data: ArrayBuffer): Promise<ArrayBuffer> {
    return subtle.sign(
      ECDSA_PARAMS, this.cryptoKey, data) as Promise<ArrayBuffer>
  }

  async exportPrivateKey(): Promise<PrivateKey> {
    const jwk = await exportJWK(this.cryptoKey)
    return new PrivateKey(ECDSA_P256, {
      X: jwk.x,
      Y: jwk.y,
      D: jwk.d,
    })
  }
}

export class ECDSAVerifier implements Verifier {
  constructor(private readonly cryptoKey: CryptoKey) {}

  readonly algorithm = ECDSA_P256

  verify(data: ArrayBuffer, signature: ArrayBuffer): Promise<boolean> {
    return subtle.verify(ECDSA_PARAMS, this.cryptoKey, signature,
      data) as Promise<boolean>
  }

  async exportPublicKey(): Promise<PublicKey> {
   const jwk = await exportJWK(this.cryptoKey)
    return new PublicKey(ECDSA_P256, {
      X: jwk.x,
      Y: jwk.y,
    })
  }
}

export class ECDSACredentials implements Credentials {
  constructor(
    private readonly signer: ECDSASigner,
    private readonly verifier: ECDSAVerifier,
  ) {}

  readonly algorithm = ECDSA_P256

  sign(data: ArrayBuffer): Promise<ArrayBuffer> {
    return this.signer.sign(data)
  }

  verify(data: ArrayBuffer, signature: ArrayBuffer): Promise<boolean> {
    return this.verifier.verify(data, signature)
  }

  exportPrivateKey(): Promise<PrivateKey> {
    return this.signer.exportPrivateKey()
  }

  exportPublicKey(): Promise<PublicKey> {
    return this.verifier.exportPublicKey()
  }
}

export class ECDSACredentialer implements Credentialer {
  constructor(private readonly extractable: boolean = false) {}

  readonly algorithm = ECDSA_P256

  async generate(): Promise<ECDSACredentials> {
    const pair = await subtle.generateKey(ECDSA_KEY_GEN_PARAMS, this.extractable,
      KEY_USAGE_CREDENTIALER)

    return new ECDSACredentials(
      new ECDSASigner(pair.privateKey),
      new ECDSAVerifier(pair.publicKey),
    )
  }

  async create(publicKey: PublicKey, privateKey: PrivateKey): Promise<ECDSACredentials> {
    const [signer, verifier] = await Promise.all([
      this.createSigner(privateKey),
      this.createVerifier(publicKey),
    ])
    return new ECDSACredentials(signer, verifier)
  }

  async createSigner(key: PrivateKey): Promise<ECDSASigner> {
    if (key.algorithm !== ECDSA_P256) {
      throw new Error(`unexpected algorithm "${key.algorithm}", expected "${ECDSA_P256}"`)
    }

    const jwk: JsonWebKey = {
      kty: 'EC',
      crv: 'P-256',
      ext: this.extractable,
      x: key.data.X,
      y: key.data.Y,
      d: key.data.D,
    }

    const cryptoKey = await importJWK(jwk, this.extractable, KEY_USAGE_SIGN)
    return new ECDSASigner(cryptoKey)
  }

  async createVerifier(key: PublicKey): Promise<ECDSAVerifier> {
    if (key.algorithm !== ECDSA_P256) {
      throw new Error(`unexpected algorithm "${key.algorithm}", expected "${ECDSA_P256}"`)
    }

    const jwk: JsonWebKey = {
      kty: 'EC',
      crv: 'P-256',
      ext: this.extractable,
      x: key.data.X,
      y: key.data.Y,
    }

    const cryptoKey = await importJWK(jwk, this.extractable, KEY_USAGE_VERIFY)
    return new ECDSAVerifier(cryptoKey)
  }
}

function importJWK(jwk: JsonWebKey, extractable: boolean, usages: string[]): Promise<CryptoKey> {
  const format = 'jwk'
  return subtle.importKey(format, jwk, ECDSA_KEY_GEN_PARAMS, extractable,
    usages) as Promise<CryptoKey>
}
