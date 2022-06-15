import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedCardSmComponent } from './feed-card-sm.component';

describe('FeedCardSmComponent', () => {
    let component: FeedCardSmComponent;
    let fixture: ComponentFixture<FeedCardSmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeedCardSmComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedCardSmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
