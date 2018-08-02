import { PublicKey } from './keys'
import { validateTypes } from './utils/'

/* Declaration binds an encoded Testament to a signature. */
export class Declaration {
  constructor(
    /* claim is an encoded Testament. */
    public readonly claim: string,

    /* signer is an optional identifier of the signer. */
    public readonly signer: string,

    /* signature is the cryptographic signature of the claim. */
    public readonly signature: string,
  ) {}

  /* unpack parses a Testament from the Base64 encoded JSON claim string. */
  unpack(): Testament {
    const json = window.atob(this.claim)
    const tst = JSON.parse(json)

    validateTypes(tst, {
      ID: 'string',
      Subject: {
        ID: 'string',
        PublicKey: {
          Algorithm: 'string',
          Public: 'object',
        },
      },
      Claims: 'object',
      Expires: 'string',
    })

    return {
      id: tst.ID,
      subject: {
        id: tst.Subject.ID,
        publicKey: PublicKey.fromJSON(tst.Subject.PublicKey),
      },
      claims: tst.Claims,
    }
  }
}

/* Certificate is simply a chain of declarations. */
export class Certificate {
  constructor(public readonly declarations: Declaration[]) {}

  /* fromJSON parses a certificate from its canonical JSON representation. */
  static fromJSON(data: CertificateJSON): Certificate {
    validateTypes(data, { Declarations: 'array' })

    const declarations = data.Declarations.map((d: any) => {
      validateTypes(d, {
        Claim: 'string',
        Signer: 'string',
        Signature: 'string',
      })

      return new Declaration(d.Claim, d.Signer, d.Signature)
    })

    return new Certificate(declarations)
  }

  /* toJSON serializes a certificate to its canonical JSON representation. */
  toJSON(): CertificateJSON {
    return {
      Declarations: this.declarations.map(d => ({
        Claim: d.claim,
        Signer: d.signer,
        Signature: d.signature,
      })),
    }
  }

}

/* CertificateJSON is the canonical JSON serialization of a Certificate. */
export interface CertificateJSON {
  readonly Declarations: {
    readonly Claim: string,
    readonly Signer: string,
    readonly Signature: string,
  }[]
}

/* Testament captures an assertion about a given subject. */
export interface Testament {
  readonly id: string
  readonly subject: {
    readonly id: string
    readonly publicKey: PublicKey;
  }
  readonly claims: {
    readonly [key: string]: any;
  }
}
