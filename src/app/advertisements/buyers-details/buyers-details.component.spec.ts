import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersDetailsComponent } from './buyers-details.component';

describe('BuyersDetailsComponent', () => {
  let component: BuyersDetailsComponent;
  let fixture: ComponentFixture<BuyersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
