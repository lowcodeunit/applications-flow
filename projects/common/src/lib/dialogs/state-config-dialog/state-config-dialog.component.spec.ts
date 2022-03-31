import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateConfigDialogComponent } from './state-config-dialog.component';

describe('StateConfigDialogComponent', () => {
    let component: StateConfigDialogComponent;
    let fixture: ComponentFixture<StateConfigDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StateConfigDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StateConfigDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
