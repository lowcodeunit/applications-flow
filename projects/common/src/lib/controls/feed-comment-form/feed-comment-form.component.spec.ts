import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedCommentFormComponent } from './feed-comment-form.component';

describe('FeedCommentFormComponent', () => {
    let component: FeedCommentFormComponent;
    let fixture: ComponentFixture<FeedCommentFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeedCommentFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedCommentFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
