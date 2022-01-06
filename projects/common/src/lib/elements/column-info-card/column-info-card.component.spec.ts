import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnInfoCardComponent } from './column-info-card.component';

describe('ColumnInfoCardComponent', () => {
  let component: ColumnInfoCardComponent;
  let fixture: ComponentFixture<ColumnInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
