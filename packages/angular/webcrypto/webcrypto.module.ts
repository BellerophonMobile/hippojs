import { ModuleWithProviders, NgModule } from '@angular/core'

import {
  CredentialService, PKCipherService, SKCipherService,
} from '@bellerophon-mobile/angular-hippo'

import { WebCryptoCredentialService } from './credential.service'
import { WebCryptoPKCipherService } from './pk-cipher.service'
import { WebCryptoSKCipherService } from './sk-cipher.service'

@NgModule()
export class HippoWebCryptoModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HippoWebCryptoModule,
      providers: [
        { provide: CredentialService, useClass: WebCryptoCredentialService },
        { provide: PKCipherService, useClass: WebCryptoPKCipherService },
        { provide: SKCipherService, useClass: WebCryptoSKCipherService },
      ],
    }
  }

}
