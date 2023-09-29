import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsarticlesListComponent } from './newsarticles-list.component';

describe('NewsarticlesListComponent', () => {
  let component: NewsarticlesListComponent;
  let fixture: ComponentFixture<NewsarticlesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsarticlesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsarticlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
