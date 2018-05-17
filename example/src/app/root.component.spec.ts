import { Type } from '@angular/core'
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'

import { CredentialService } from '@bellerophon-mobile/angular-hippo'

import { RootComponent } from './root.component'

describe('RootComponent', () => {
  beforeEach(async () => {
    const credentialServiceMock = jasmine.createSpyObj('CredentialService', [
      'generate',
    ])

    await TestBed
      .configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [RootComponent],
        providers: [
          { provide: CredentialService, useValue: credentialServiceMock },
        ],
      })
      .compileComponents()
  })

  let fixture: ComponentFixture<RootComponent>
  let component: RootComponent
  let credentialService: CredentialService

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent)
    component = fixture.debugElement.componentInstance
    credentialService = fixture.debugElement.injector.get(CredentialService as Type<CredentialService>)
  })

  it('should create the root', () => {
    expect(component).toBeTruthy()
  })

  it('should be able to generate credentials', fakeAsync(() => {
    (credentialService.generate as any).and.returnValue(Promise.reject('test'))

    component.generateCredentials()
    tick()

    expect(credentialService.generate).toHaveBeenCalledWith('ecdsa-p256')
    expect(component.error).toEqual('test')
  }))
})
