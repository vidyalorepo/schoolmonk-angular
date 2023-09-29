import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VidyaloContentComponent } from './vidyalo-content.component';

describe('VidyaloContentComponent', () => {
  let component: VidyaloContentComponent;
  let fixture: ComponentFixture<VidyaloContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VidyaloContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VidyaloContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
