import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantNavyComponent } from './merchant-navy.component';

describe('MerchantNavyComponent', () => {
  let component: MerchantNavyComponent;
  let fixture: ComponentFixture<MerchantNavyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantNavyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantNavyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
