import { Certificate, Declaration } from './certificate'
import { PublicKey } from './keys'

// tslint:disable:max-line-length
const testCertJSON = `
{
 "Declarations": [
  {
   "Claim": "eyJJRCI6IiIsIlN1YmplY3QiOnsiSUQiOiJ0ZXN0IiwiUHVibGljS2V5Ijp7IkFsZ29yaXRobSI6ImVjZHNhLXAyNTYiLCJQdWJsaWMiOnsiWCI6InBONFJZTUFaTGFsMUVsNTN0VFd1NTE1MTRPejRJVFVBTS1UdXc5NmlvY1kiLCJZIjoiaWhRQkQ0UUNJdDBvRTBuUjQ1QlFXZy0zUUI5cThxaHhWVWc4VF9hTUhBdyJ9fX0sIkNsYWltcyI6eyJUZXN0Q2xhaW0iOiJUZXN0VmFsdWUifSwiRXhwaXJlcyI6IiJ9",
   "Signer": "",
   "Signature": "IUzh+xzun4991vwBnFsGct81ZX845Flrye1dEHMJM7uX1uzveI83FuTpYixwRcvSsDtLk3UhbFCxL7HnCeazCA=="
  }
 ]
}`

const testCert = new Certificate([
  new Declaration(
    'eyJJRCI6IiIsIlN1YmplY3QiOnsiSUQiOiJ0ZXN0IiwiUHVibGljS2V5Ijp7IkFsZ29yaXRobSI6ImVjZHNhLXAyNTYiLCJQdWJsaWMiOnsiWCI6InBONFJZTUFaTGFsMUVsNTN0VFd1NTE1MTRPejRJVFVBTS1UdXc5NmlvY1kiLCJZIjoiaWhRQkQ0UUNJdDBvRTBuUjQ1QlFXZy0zUUI5cThxaHhWVWc4VF9hTUhBdyJ9fX0sIkNsYWltcyI6eyJUZXN0Q2xhaW0iOiJUZXN0VmFsdWUifSwiRXhwaXJlcyI6IiJ9',
    '',
    'IUzh+xzun4991vwBnFsGct81ZX845Flrye1dEHMJM7uX1uzveI83FuTpYixwRcvSsDtLk3UhbFCxL7HnCeazCA==',
  ),
])

const testPublicKey = new PublicKey('ecdsa-p256', {
  X: 'pN4RYMAZLal1El53tTWu51514Oz4ITUAM-Tuw96iocY',
  Y: 'ihQBD4QCIt0oE0nR45BQWg-3QB9q8qhxVUg8T_aMHAw',
})
// tslint:enable:max-line-length

describe('Certificate', () => {

  it('should deserialize properly', () => {
    const cert = Certificate.fromJSON(testCertJSON)
    expect(cert).toEqual(testCert)
  })

  it('should unpack testaments properly', () => {
    const tst = testCert.declarations[0].unpack()
    expect(tst).toEqual({
      id: '',
      subject: {
        id: 'test',
        publicKey: testPublicKey,
      },
      claims: {
        TestClaim: 'TestValue',
      },
    })
  })

})
