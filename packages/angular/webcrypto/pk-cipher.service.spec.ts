import { inject, TestBed } from '@angular/core/testing'

import { PrivateKey, PublicKey } from '@bellerophon-mobile/hippo'
import { RSAPKCipher } from '@bellerophon-mobile/hippo/webcrypto'

import { EXTRACTABLE } from './extractable.token'
import { WebCryptoPKCipherService } from './pk-cipher.service'

// tslint:disable:max-line-length
const testPublicKey = new PublicKey('rsa-oaep-2048', {
  E: 'AQAB',
  N: 'u-4QvuAxeFUFUUuRHhHHP6rgAF5RcdsY_KLKG8l0pbbWo-mBztBs0vhaPbOQdTARvDyzJey8Nf40BI-6U6gjJIbz_QL2ZpAo8KU8o-u5_UDGSSMpjx9e380jJ0Ve7_GSJv7JNKwZ9s3cw9ec_3jAyOfv0B_zvZbDWCMV3SaR75WFYlDE1L7pXGY-U5jW3gc1loEPzkt84yzpHefUHdaM2ESKCSjAUZe5AmcxNBxMp8a5FpSSnYqiqbEcZKs_DQwz1IUoANsKuNSahDRuFI0m5ygbd_C8G6bkMaypAcGcsiYsc16b6LXGbQoO00HHOolzoVKvogZkgw4IC5liQn3ATw',
})

const testPrivateKey = new PrivateKey('rsa-oaep-2048', {
  E: 'AQAB',
  D: 'F5snAar3W9ZQ1YOIpikf3kNQYYt3bzX7ygQyyfxrXsN8QQOnBBD8knWSyaGsGXmhHgQr5q15fiNrv6Tu3UJHWSJrNH1c8R4rnlV11rYDW1NPH5xp7ynxc2r4_vOrog019BhYss6UG63ZN2_L2e_-RgjoVTwmPvWDR9IZwCPvpz3phN9PQptsGRD6nvJ8KEVU2CHl5PDcgqUZ6J6_EZRovccQ3rU05JeZu48qdBaEIzFvUxDYUytIl_rOSUt3lQTM6lrYYlXDv9__E_aSsno-4A0DVdqOiDivN78-avXdMzWHqSWJoozC4NIreEOk4to221sZIvq1koo83BZxrRyiKQ',
  DP: 'DpWaEfYxZ8pPgIYLudT0iqN515PbfZ6tvoKAHk-EfqgJzrGYO6G6D9NNmPbbhhSTR9RsXMhr-3p1RfGOjKRLJUNZsT59zqf5txwYfwzDNENGfdep1qgJCluBekOgnhtJ24ORhhgygwP5QNAQSiKhfUUb2rWQ6HOCFcFrMbLpAgk',
  DQ: 'A3VVXLQesxobRP0-NkzYdBfGW0mWxkNlwUsYM-pJPdizGd9psu2VU_ZKrU6UcwAUZBS70xvU4LDunSP3Vp56Zl4EUpbvbrJIUNfZt5MoPkrd7HjMNZKNbv4urF282WUv9kcs_EroYLSQt-NrH73eXIhkmWV_tOJHve-58626PR0',
  N: 'u-4QvuAxeFUFUUuRHhHHP6rgAF5RcdsY_KLKG8l0pbbWo-mBztBs0vhaPbOQdTARvDyzJey8Nf40BI-6U6gjJIbz_QL2ZpAo8KU8o-u5_UDGSSMpjx9e380jJ0Ve7_GSJv7JNKwZ9s3cw9ec_3jAyOfv0B_zvZbDWCMV3SaR75WFYlDE1L7pXGY-U5jW3gc1loEPzkt84yzpHefUHdaM2ESKCSjAUZe5AmcxNBxMp8a5FpSSnYqiqbEcZKs_DQwz1IUoANsKuNSahDRuFI0m5ygbd_C8G6bkMaypAcGcsiYsc16b6LXGbQoO00HHOolzoVKvogZkgw4IC5liQn3ATw',
  P: '6RG08HkQCrgbJN0-2mal5aiDB-i4XgVUKLcwzbniy-jOqyD0hzUagI2qfv-X74a7q9WQVjGcvWvaUjOXw8BQf8ADSHxJ-z4CkI_Mwldov6vGY-ND3-gCpXUIyZKwRKkKmYbWd5YqxgnhNjQhWML9D1THfr8eJtqESuCo_RKVgGk',
  Q: 'zmtw2pM2YD8JlN600Z3JMfKU_4VgfXm1jXzZ_6XOmlUWhBVZnAtAPmVWLCAeNjbhulEdVx5Ode4eU5p1Laej3oX9V_VHuYWZNandXBC-lt_gIyQQaCm8R7iT8htUMtXiCDFBn-q01clO6S7dw5yznrf8r9Ggf0wnOExyklgco_c',
  QI: 'UrmCppVEqvsWTjIkTK625cofRznKQbj9KCQrnr8wMxGl26sBHiKdJZ7idM2umkkkDnhY1xss9CaVjwZFwjNweEnKY2ct7n3POSSIWNqVsLExRKcU0uBbphHyt5AMQlRgCNpElY__5cieZOJiENrfx-ybBYR_Y0V4LjAP4uv_vS4',
})
// tslint:enable:max-line-length

describe('WebCryptoPKCipherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EXTRACTABLE, useValue: true },
        WebCryptoPKCipherService,
      ],
    })
  })

  let service: WebCryptoPKCipherService

  beforeEach(inject([WebCryptoPKCipherService], (s: WebCryptoPKCipherService) => service = s))

  it('should be created', () => {
    expect(service instanceof WebCryptoPKCipherService).toBeTruthy()
  })

  it('should generate an RSA-OAEP-2048 cipher', async () => {
    const cipher = await service.generate('rsa-oaep-2048')
    expect(cipher instanceof RSAPKCipher).toBeTruthy()
  })

  it('should wrap public/private keys', async () => {
    const cipher = await service.create(testPublicKey, testPrivateKey)
    const publicKey = await cipher.exportPublicKey()
    const privateKey = await cipher.exportPrivateKey()

    expect(publicKey).toEqual(testPublicKey)
    expect(privateKey).toEqual(testPrivateKey)
  })

  it('should wrap a public key', async () => {
    const encrypter = await service.createEncrypter(testPublicKey)
    const publicKey = await encrypter.exportPublicKey()

    expect(publicKey).toEqual(testPublicKey)
  })

  it('should wrap a private key', async () => {
    const decrypter = await service.createDecrypter(testPrivateKey)
    const privateKey = await decrypter.exportPrivateKey()

    expect(privateKey).toEqual(testPrivateKey)
  })

})
