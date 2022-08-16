import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateConfigPageComponent } from './state-config-page.component';

describe('StateConfigPageComponent', () => {
    let component: StateConfigPageComponent;
    let fixture: ComponentFixture<StateConfigPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StateConfigPageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StateConfigPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
