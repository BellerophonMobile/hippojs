import { InjectionToken } from '@angular/core'

/* Token to define whether WebCrypto keys are extractable. */
export const EXTRACTABLE = new InjectionToken<boolean>('WebCrypto Keys Extractable')
