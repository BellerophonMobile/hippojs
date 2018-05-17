import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import { ExtractableToken } from '@bellerophon-mobile/angular-hippo'

import { RootComponent } from './root.component'

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: ExtractableToken, useValue: true },
  ],
  declarations: [RootComponent],
  bootstrap: [RootComponent],
})
export class AppModule {}
