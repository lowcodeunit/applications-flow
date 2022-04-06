import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonFeedCardComponent } from './skeleton-feed-card.component';

describe('SkeletonFeedCardComponent', () => {
    let component: SkeletonFeedCardComponent;
    let fixture: ComponentFixture<SkeletonFeedCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SkeletonFeedCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SkeletonFeedCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
