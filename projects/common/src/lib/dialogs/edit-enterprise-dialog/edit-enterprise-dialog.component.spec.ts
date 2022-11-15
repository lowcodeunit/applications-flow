import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnterpriseDialogComponent } from './edit-enterprise-dialog.component';

describe('EditEnterpriseDialogComponent', () => {
    let component: EditEnterpriseDialogComponent;
    let fixture: ComponentFixture<EditEnterpriseDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditEnterpriseDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditEnterpriseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
