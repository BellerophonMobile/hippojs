import {
  CredentialerFactory, PKCiphererFactory, SKCiphererFactory,
} from '@bellerophon-mobile/hippo'

import { AES_256_CBC, AES_256_GCM, AESSKCipherer } from './aes'
import { ECDSACredentialer } from './ecdsa'
import { RSAPKCipherer } from './rsa'

const EXTRACTABE = true

export const credentialerFactory = new CredentialerFactory(
  new ECDSACredentialer(EXTRACTABE),
)

export const pkCiphererFactory = new PKCiphererFactory(
  new RSAPKCipherer(EXTRACTABE),
)

export const skCiphererFactory = new SKCiphererFactory(
  new AESSKCipherer(AES_256_CBC, EXTRACTABE),
  new AESSKCipherer(AES_256_GCM, EXTRACTABE),
)
