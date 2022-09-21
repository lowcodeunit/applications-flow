import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EaCService } from '../../services/eac.service';

export interface AddTeamMemberDialogData {
    enterprise: any;
}

@Component({
    selector: 'lcu-add-team-member-dialog',
    templateUrl: './add-team-member-dialog.component.html',
    styleUrls: ['./add-team-member-dialog.component.scss'],
})
export class AddTeamMemberDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AddTeamMemberDialogComponent>,
        protected eacSvc: EaCService,
        @Inject(MAT_DIALOG_DATA) public data: AddTeamMemberDialogData,
        protected snackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {}

    public CloseDialog() {
        this.dialogRef.close();
    }
}
