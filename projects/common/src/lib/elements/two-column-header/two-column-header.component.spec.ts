import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnHeaderComponent } from './two-column-header.component';

describe('TwoColumnHeaderComponent', () => {
  let component: TwoColumnHeaderComponent;
  let fixture: ComponentFixture<TwoColumnHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoColumnHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoColumnHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
