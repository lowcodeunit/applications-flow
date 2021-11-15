import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KrakynDataFlowComponent } from './krakyn-data-flow.component';

describe('KrakynDataFlowComponent', () => {
  let component: KrakynDataFlowComponent;
  let fixture: ComponentFixture<KrakynDataFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KrakynDataFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KrakynDataFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
