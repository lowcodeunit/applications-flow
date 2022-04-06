import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlottedCardComponent } from './slotted-card.component';

describe('SlottedCardComponent', () => {
    let component: SlottedCardComponent;
    let fixture: ComponentFixture<SlottedCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SlottedCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SlottedCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
