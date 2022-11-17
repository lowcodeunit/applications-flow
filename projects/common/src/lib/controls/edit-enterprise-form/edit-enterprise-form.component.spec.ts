import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnterpriseFormComponent } from './edit-enterprise-form.component';

describe('EditEnterpriseFormComponent', () => {
    let component: EditEnterpriseFormComponent;
    let fixture: ComponentFixture<EditEnterpriseFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditEnterpriseFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditEnterpriseFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
