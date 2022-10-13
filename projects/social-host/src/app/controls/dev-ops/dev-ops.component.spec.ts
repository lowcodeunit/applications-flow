import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevOpsComponent } from './dev-ops.component';

describe('DevOpsComponent', () => {
    let component: DevOpsComponent;
    let fixture: ComponentFixture<DevOpsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DevOpsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DevOpsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
