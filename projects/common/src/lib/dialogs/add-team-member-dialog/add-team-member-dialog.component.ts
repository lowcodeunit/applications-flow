import { Component, OnInit, Inject } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
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
    public AddTeamMemberFormGroup: FormGroup;

    public Enterprise: any;

    public get Email(): AbstractControl {
        return this.AddTeamMemberFormGroup?.controls.email;
    }

    public get Permission(): AbstractControl {
        return this.AddTeamMemberFormGroup?.controls.permission;
    }

    constructor(
        public dialogRef: MatDialogRef<AddTeamMemberDialogComponent>,
        protected eacSvc: EaCService,
        @Inject(MAT_DIALOG_DATA) public data: AddTeamMemberDialogData,
        protected snackBar: MatSnackBar,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.BuildForm();

        this.Enterprise = this.data.enterprise;
        console.log('ent: ', this.Enterprise);
    }

    public AddMember() {
        console.log('ent lookup: ', this.Enterprise.ParentEnterpriseLookup);
        console.log('invited: ', this.Email.value);
        console.log('permission: ', this.Permission.value);
    }

    public BuildForm() {
        this.AddTeamMemberFormGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            permission: new FormControl('', [Validators.required]),
        });
    }

    public Cancel() {
        this.CloseDialog();
    }

    public GetErrorMessage() {
        if (this.Email.hasError('required')) {
            return 'You must enter a value';
        }

        return this.Email.hasError('email') ? 'Not a valid email' : '';
    }

    public CloseDialog() {
        this.dialogRef.close();
    }
}
