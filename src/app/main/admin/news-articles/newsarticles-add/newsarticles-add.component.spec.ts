import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsarticlesAddComponent } from './newsarticles-add.component';

describe('NewsarticlesAddComponent', () => {
  let component: NewsarticlesAddComponent;
  let fixture: ComponentFixture<NewsarticlesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsarticlesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsarticlesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
