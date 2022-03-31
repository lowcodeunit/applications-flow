import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFeedCardComponent } from './main-feed-card.component';

describe('MainFeedCardComponent', () => {
    let component: MainFeedCardComponent;
    let fixture: ComponentFixture<MainFeedCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainFeedCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainFeedCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
