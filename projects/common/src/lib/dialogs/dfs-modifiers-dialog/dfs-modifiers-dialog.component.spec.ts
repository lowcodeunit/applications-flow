import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DFSModifiersDialogComponent } from './dfs-modifiers-dialog.component';

describe('ProcessorDetailsDialogComponent', () => {
    let component: DFSModifiersDialogComponent;
    let fixture: ComponentFixture<DFSModifiersDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DFSModifiersDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DFSModifiersDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
