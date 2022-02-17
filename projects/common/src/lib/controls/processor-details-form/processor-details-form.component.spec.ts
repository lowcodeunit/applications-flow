import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorDetailsFormComponent } from './processor-details-form.component';

describe('ProcessorDetailsFormComponent', () => {
  let component: ProcessorDetailsFormComponent;
  let fixture: ComponentFixture<ProcessorDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessorDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessorDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
