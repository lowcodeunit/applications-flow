import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EaCEnterpriseDetails, Status } from '@semanticjs/common';
import { Subscription } from 'rxjs';
import { EditEnterpriseFormComponent } from '../../controls/edit-enterprise-form/edit-enterprise-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface EnterpriseDialogData {
    enterprise: EaCEnterpriseDetails;
}

@Component({
    selector: 'lcu-edit-enterprise-dialog',
    templateUrl: './edit-enterprise-dialog.component.html',
    styleUrls: ['./edit-enterprise-dialog.component.scss'],
})
export class EditEnterpriseDialogComponent implements OnInit {
    @ViewChild(EditEnterpriseFormComponent)
    public EditEnterpriseControl: EditEnterpriseFormComponent;

    public get EnterpriseFormGroup(): FormGroup {
        return this.EditEnterpriseControl?.EnterpriseFormGroup;
    }

    constructor(
        protected eacSvc: EaCService,
        public dialogRef: MatDialogRef<EditEnterpriseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EnterpriseDialogData,
        protected snackBar: MatSnackBar
    ) {}

    public State: ApplicationsFlowState;

    public ErrorMessage: string;

    protected StateSub: Subscription;

    public ngOnInit(): void {
        // console.log('Ent: ', this.data.enterprise);
        this.StateSub = this.eacSvc.State.subscribe((state) => {
            this.State = state;
        });
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public HandleSaveFormEvent(event: Status) {
        // console.log('event to save: ', event);
        if (event.Code === 0) {
            this.snackBar.open('Enterprise Succesfully Updated', 'Dismiss', {
                duration: 5000,
            });

            this.CloseDialog();
        } else {
            this.ErrorMessage = event.Message;
        }
    }

    public SaveEnterprise() {
        this.EditEnterpriseControl.SaveEnterpriseDetails();
    }
}
