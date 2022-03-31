import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDomainDialogComponent } from './custom-domain-dialog.component';

describe('CustomDomainDialogComponent', () => {
    let component: CustomDomainDialogComponent;
    let fixture: ComponentFixture<CustomDomainDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomDomainDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomDomainDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
