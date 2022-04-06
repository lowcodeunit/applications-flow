import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceControlDialogComponent } from './source-control-dialog.component';

describe('SourceControlDialogComponent', () => {
    let component: SourceControlDialogComponent;
    let fixture: ComponentFixture<SourceControlDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceControlDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceControlDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
