import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
import { Subscription } from 'rxjs';
import { DevopsSourceControlFormComponent } from '../../controls/devops-source-control-form/devops-source-control-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface SCDialogData {
    environment: EaCEnvironmentAsCode;
    environmentLookup: string;
    scLookup: string;
    scName: string;
}

@Component({
    selector: 'lcu-source-control-dialog',
    templateUrl: './source-control-dialog.component.html',
    styleUrls: ['./source-control-dialog.component.scss'],
})
export class SourceControlDialogComponent implements OnInit, OnDestroy {
    @ViewChild(DevopsSourceControlFormComponent)
    public DevopsSourceControl: DevopsSourceControlFormComponent;

    public get DevOpsSourceControlFormGroup(): FormGroup {
        return this.DevopsSourceControl?.DevOpsSourceControlFormGroup;
    }

    public ErrorMessage: string;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    constructor(
        public dialogRef: MatDialogRef<SourceControlDialogComponent>,
        protected eacSvc: EaCService,
        @Inject(MAT_DIALOG_DATA) public data: SCDialogData,
        protected snackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;
            }
        );
    }

    public ngOnDestroy(): void {
        this.StateSub.unsubscribe();
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public DeleteSourceControl(): void {
        this.eacSvc
            .DeleteSourceControl(this.data.scLookup, this.data.scName)
            .then((status) => {
                this.CloseDialog();
            });
    }

    public HandleSaveStatusEvent(event: Status) {
        console.log('event to save: ', event);
        if (event.Code === 0) {
            this.snackBar.open('Source Control Succesfully Saved', 'Dismiss', {
                duration: 5000,
            });
            this.CloseDialog();
        } else {
            this.ErrorMessage = event.Message;
        }
    }

    public SaveSourceControl() {
        this.DevopsSourceControl.SaveSourceControl();
    }
}
