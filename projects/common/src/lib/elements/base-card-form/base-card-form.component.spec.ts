import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCardFormComponent } from './base-card-form.component';

describe('BaseCardFormComponent', () => {
  let component: BaseCardFormComponent;
  let fixture: ComponentFixture<BaseCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCardFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
