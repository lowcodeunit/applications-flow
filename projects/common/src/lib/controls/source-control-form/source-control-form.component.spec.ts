import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceControlFormComponent } from './source-control-form.component';

describe('SourceControlFormComponent', () => {
  let component: SourceControlFormComponent;
  let fixture: ComponentFixture<SourceControlFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceControlFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceControlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
