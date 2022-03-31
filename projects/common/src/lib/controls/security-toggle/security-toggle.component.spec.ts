import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityToggleComponent } from './security-toggle.component';

describe('SecurityToggleComponent', () => {
    let component: SecurityToggleComponent;
    let fixture: ComponentFixture<SecurityToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SecurityToggleComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
