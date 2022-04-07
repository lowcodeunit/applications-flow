import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorDetailsDialogComponent } from './processor-details-dialog.component';

describe('ProcessorDetailsDialogComponent', () => {
    let component: ProcessorDetailsDialogComponent;
    let fixture: ComponentFixture<ProcessorDetailsDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProcessorDetailsDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessorDetailsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
