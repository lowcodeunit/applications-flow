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
import { EaCProjectAsCode, EnterpriseAsCode } from '@semanticjs/common';
import {
    EaCService,
    SaveProjectAsCodeEventRequest,
} from '../../services/eac.service';

export interface AddTeamMemberDialogData {
    enterprise: any;
    projectLookup: string;
    projects: any;
}

@Component({
    selector: 'lcu-add-team-member-dialog',
    templateUrl: './add-team-member-dialog.component.html',
    styleUrls: ['./add-team-member-dialog.component.scss'],
})
export class AddTeamMemberDialogComponent implements OnInit {
    public AddTeamMemberFormGroup: FormGroup;

    public Enterprise: any;

    public Projects: any;

    public ProjectLookup: any;

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

        this.Projects = this.data.projects;
        console.log('projects: ', this.Projects);
        this.ProjectLookup = this.data.projectLookup;
        console.log('ent: ', this.Enterprise);
    }

    //include current project, ent lookup, relyingparty, accessconfig and then the user list

    public AddMember() {
        console.log('ent lookup: ', this.Enterprise.ParentEnterpriseLookup);
        console.log('invited: ', this.Email.value);
        // console.log('permission: ', this.Permission.value);

        let proj: EaCProjectAsCode = this.Projects[this.ProjectLookup];
        console.log('Proj: ', proj);

        proj.RelyingParty.AccessConfigurations[
            this.Projects[
                this.data.projectLookup
            ].RelyingParty.DefaultAccessConfigurationLookup
        ].Usernames = [this.Email.value];

        const saveProjectRequest: SaveProjectAsCodeEventRequest = {
            Project: proj,
            ProjectLookup: this.data.projectLookup,
        };
        console.log('Add member request: ', saveProjectRequest);
        this.eacSvc.SaveProjectAsCode(saveProjectRequest).then((result) => {
            if (result.Code === 0) {
                this.snackBar.open('Member Succesfully Added', 'Dismiss', {
                    duration: 5000,
                });
                this.CloseDialog();
            } else {
                console.log('FAILED: ', result.Message);
            }
        });
    }

    public BuildForm() {
        // permission: new FormControl('', [Validators.required]),
        this.AddTeamMemberFormGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
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
