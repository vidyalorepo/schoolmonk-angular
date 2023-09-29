import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineArtsComponent } from './fine-arts.component';

describe('FineArtsComponent', () => {
  let component: FineArtsComponent;
  let fixture: ComponentFixture<FineArtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FineArtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FineArtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
