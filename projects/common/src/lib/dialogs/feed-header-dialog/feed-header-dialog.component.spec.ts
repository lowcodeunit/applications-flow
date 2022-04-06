import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedHeaderDialogComponent } from './feed-header-dialog.component';

describe('FeedHeaderDialogComponent', () => {
    let component: FeedHeaderDialogComponent;
    let fixture: ComponentFixture<FeedHeaderDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeedHeaderDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedHeaderDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
