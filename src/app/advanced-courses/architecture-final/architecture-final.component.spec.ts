import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureFinalComponent } from './architecture-final.component';

describe('ArchitectureFinalComponent', () => {
  let component: ArchitectureFinalComponent;
  let fixture: ComponentFixture<ArchitectureFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchitectureFinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitectureFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
