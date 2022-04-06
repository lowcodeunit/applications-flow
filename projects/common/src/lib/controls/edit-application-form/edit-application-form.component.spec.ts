import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplicationFormComponent } from './edit-application-form.component';

describe('EditApplicationFormComponent', () => {
    let component: EditApplicationFormComponent;
    let fixture: ComponentFixture<EditApplicationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditApplicationFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditApplicationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
