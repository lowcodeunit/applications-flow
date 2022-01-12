import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhControlComponent } from './gh-control.component';

describe('GhControlComponent', () => {
  let component: GhControlComponent;
  let fixture: ComponentFixture<GhControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
