import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EditApplicationFormComponent } from '../../controls/edit-application-form/edit-application-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface ApplicationDialogData {
    application: EaCApplicationAsCode;
    applicationLookup: string;
    projectLookup: string;
}

@Component({
    selector: 'lcu-edit-application-dialog',
    templateUrl: './edit-application-dialog.component.html',
    styleUrls: ['./edit-application-dialog.component.scss'],
})
export class EditApplicationDialogComponent implements OnInit {
    @ViewChild(EditApplicationFormComponent)
    public EditApplicationControl: EditApplicationFormComponent;

    public get ApplicationFormGroup(): FormGroup {
        return this.EditApplicationControl?.ApplicationFormGroup;
    }

    public ErrorMessage: string;

    public State: ApplicationsFlowState;

    constructor(
        public eacSvc: EaCService,
        public dialogRef: MatDialogRef<EditApplicationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ApplicationDialogData,
        protected snackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {
        this.eacSvc.State.subscribe((state) => {
            this.State = state;
        });
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public HandleSaveApplicationEvent(event: Status) {
        console.log('event to save: ', event);
        if (event.Code === 0) {
            this.snackBar.open('Application Succesfully Updated', 'Dismiss', {
                duration: 5000,
            });
            this.CloseDialog();
        } else {
            this.ErrorMessage = event.Message;
        }
    }

    public SaveApplication() {
        this.EditApplicationControl.SaveApplication();
    }
}
