import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedSourceComponent } from './connected-source.component';

describe('ConnectedSourceComponent', () => {
    let component: ConnectedSourceComponent;
    let fixture: ComponentFixture<ConnectedSourceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConnectedSourceComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectedSourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
