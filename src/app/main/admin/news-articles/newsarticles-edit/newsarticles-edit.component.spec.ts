import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsarticlesEditComponent } from './newsarticles-edit.component';

describe('NewsarticlesEditComponent', () => {
  let component: NewsarticlesEditComponent;
  let fixture: ComponentFixture<NewsarticlesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsarticlesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsarticlesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
