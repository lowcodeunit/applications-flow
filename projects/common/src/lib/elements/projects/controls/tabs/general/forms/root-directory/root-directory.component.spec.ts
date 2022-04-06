import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootDirectoryComponent } from './root-directory.component';

describe('RootDirectoryComponent', () => {
    let component: RootDirectoryComponent;
    let fixture: ComponentFixture<RootDirectoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RootDirectoryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RootDirectoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
