import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevopsSourceControlFormComponent } from './devops-source-control-form.component';

describe('DevopsSourceControlFormComponent', () => {
  let component: DevopsSourceControlFormComponent;
  let fixture: ComponentFixture<DevopsSourceControlFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevopsSourceControlFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevopsSourceControlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
