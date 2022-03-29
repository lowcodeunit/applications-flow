import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateConfigFormComponent } from './state-config-form.component';

describe('StateConfigFormComponent', () => {
  let component: StateConfigFormComponent;
  let fixture: ComponentFixture<StateConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
