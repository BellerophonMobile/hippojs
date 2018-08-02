import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

import { forkJoin, from, Subscription } from 'rxjs'
import { finalize, switchMap } from 'rxjs/operators'

import { CredentialService } from '@bellerophon-mobile/angular-hippo'
import { Certificate, Testament } from '@bellerophon-mobile/hippo'
import { ECDSA_P256 } from '@bellerophon-mobile/hippo'

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, OnDestroy {
  constructor(
    private readonly credentialService: CredentialService,
    private readonly formBuilder: FormBuilder,
  ) {}

  readonly certificateForm = this.formBuilder.group({
    json: ['', Validators.required],
  })

  credentialsSub?: Subscription
  certificate?: Certificate
  testaments?: Testament[]
  claimPairs?: { key: string, value: string }[][]

  publicKey = ''
  privateKey = ''
  error = ''

  ngOnInit(): void {
    console.log('Credential Service:', this.credentialService)
  }

  ngOnDestroy(): void {
    if (this.credentialsSub) {
      this.credentialsSub.unsubscribe()
    }
  }

  generateCredentials(): void {
    if (this.credentialsSub) {
      console.warn('already generating credentials')
      return
    }

    this.credentialsSub = from(this.credentialService.generate(ECDSA_P256))
      .pipe(
        switchMap(c => forkJoin(c.exportPublicKey(), c.exportPrivateKey())),
        finalize(() => delete this.credentialsSub),
      )
      .subscribe(
        ([pk, sk]) => {
          this.publicKey = this.pretty(pk.toJSON())
          this.privateKey = this.pretty(sk.toJSON())
        },
        err => this.error = err,
      )
  }

  parseCertificate(): void {
    if (this.certificateForm.invalid) {
      console.warn('form invalid')
      return
    }

    this.certificate = Certificate.fromJSON(this.certificateForm.value.json)
    this.testaments = this.certificate.declarations.map(d => d.unpack())
    this.claimPairs = this.testaments.map(t => Object.keys(t.claims)
      .map(key => ({ key: key, value: t.claims[key] })))
  }

  private pretty(json: string): string {
    return JSON.stringify(JSON.parse(json), null, 4)
  }
}
