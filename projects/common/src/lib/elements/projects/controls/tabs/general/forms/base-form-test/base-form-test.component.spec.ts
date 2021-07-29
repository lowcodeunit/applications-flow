import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFormTestComponent } from './base-form-test.component';

describe('TestComponent', () => {
  let component: BaseFormTestComponent;
  let fixture: ComponentFixture<BaseFormTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFormTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
