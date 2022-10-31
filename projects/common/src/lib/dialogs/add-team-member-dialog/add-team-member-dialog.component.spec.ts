import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamMemberDialogComponent } from './add-team-member-dialog.component';

describe('AddTeamMemberDialogComponent', () => {
    let component: AddTeamMemberDialogComponent;
    let fixture: ComponentFixture<AddTeamMemberDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddTeamMemberDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddTeamMemberDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
