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
        publicKey: new PublicKey(
          tst.Subject.PublicKey.Algorithm,
          tst.Subject.PublicKey.Public,
        ),
      },
      claims: tst.Claims,
    }
  }
}

/* Certificate is simply a chain of declarations. */
export class Certificate {
  constructor(public readonly declarations: Declaration[]) {}

  /* fromJSON parses a certificate from the given JSON string. */
  static fromJSON(json: string): Certificate {
    const cert = JSON.parse(json)
    validateTypes(cert, { Declarations: 'array' })

    const declarations = cert.Declarations.map((d: any) => {
      validateTypes(d, {
        Claim: 'string',
        Signer: 'string',
        Signature: 'string',
      })

      return new Declaration(d.Claim, d.Signer, d.Signature)
    })

    return new Certificate(declarations)
  }

  /* toJSON serializes a certificate to a JSON string. */
  toJSON(): string {
    const json = {
      Declarations: this.declarations.map(d => ({
        Claim: d.claim,
        Signer: d.signer,
        Signature: d.signature,
      })),
    }
    return JSON.stringify(json)
  }
}

/* Testament captures an assertion about a given subject. */
export interface Testament {
  id: string
  subject: {
    id: string
    publicKey: PublicKey;
  }
  claims: {
    [key: string]: any;
  }
}
