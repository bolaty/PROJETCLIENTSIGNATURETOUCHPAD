import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturepadComponent } from './signaturepad.component';

describe('SignaturepadComponent', () => {
  let component: SignaturepadComponent;
  let fixture: ComponentFixture<SignaturepadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignaturepadComponent]
    });
    fixture = TestBed.createComponent(SignaturepadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
