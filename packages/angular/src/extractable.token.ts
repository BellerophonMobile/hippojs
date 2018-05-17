import { InjectionToken } from '@angular/core'

/* Token to define whether WebCrypto keys are extractable. */
export const ExtractableToken = new InjectionToken<boolean>('WebCrypto Keys Extractable')
