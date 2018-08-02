import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import {
  ExtractableToken, HippoWebCryptoModule,
} from '@bellerophon-mobile/angular-hippo/webcrypto'

import { RootComponent } from './root.component'

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,

    HippoWebCryptoModule.forRoot(),
  ],
  providers: [
    { provide: ExtractableToken, useValue: true },
  ],
  declarations: [RootComponent],
  bootstrap: [RootComponent],
})
export class AppModule {}
