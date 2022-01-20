import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowToolComponent } from './flow-tool.component';

describe('FlowToolComponent', () => {
  let component: FlowToolComponent;
  let fixture: ComponentFixture<FlowToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
