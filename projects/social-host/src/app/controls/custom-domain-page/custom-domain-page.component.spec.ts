import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDomainPageComponent } from './custom-domain-page.component';

describe('CustomDomainPageComponent', () => {
    let component: CustomDomainPageComponent;
    let fixture: ComponentFixture<CustomDomainPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomDomainPageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomDomainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
