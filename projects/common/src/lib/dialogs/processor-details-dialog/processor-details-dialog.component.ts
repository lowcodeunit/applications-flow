import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import {
    EaCApplicationAsCode,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { ProcessorDetailsFormComponent } from '../../controls/processor-details-form/processor-details-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface ProcessorDetailsDialogData {
    applicationLookup: string;
    environmentLookup: string;
    projectLookup: string;
}

@Component({
    selector: 'lcu-processor-details-dialog',
    templateUrl: './processor-details-dialog.component.html',
    styleUrls: ['./processor-details-dialog.component.scss'],
})
export class ProcessorDetailsDialogComponent implements OnInit {
    @ViewChild(ProcessorDetailsFormComponent)
    public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

    public get ProcessorDetailsFormGroup(): FormGroup {
        return this.ProcessorDetailsFormControls?.ProcessorDetailsFormGroup;
    }

    public Application: EaCApplicationAsCode;

    public ErrorMessage: string;

    public Environment: EaCEnvironmentAsCode;

    public State: ApplicationsFlowState;

    public SourceControls: { [lookup: string]: EaCSourceControl };

    public SourceControlLookups: Array<string>;

    constructor(
        protected eacSvc: EaCService,
        public dialogRef: MatDialogRef<ProcessorDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProcessorDetailsDialogData,
        protected snackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {
        this.eacSvc.State.subscribe((state) => {
            this.State = state;
            if (this.State?.EaC?.Applications) {
                this.Application =
                    this.State?.EaC?.Applications[this.data.applicationLookup];
            }
            if (this.State?.EaC?.Environments) {
                this.Environment =
                    this.State?.EaC?.Environments[this.data.environmentLookup];
            }
            if (this.Environment?.Sources) {
                this.SourceControls = this.Environment?.Sources;
                this.SourceControlLookups = Object.keys(
                    this.Environment?.Sources || {}
                );
            }
        });
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public HandleSaveFormEvent(event: Status) {
        console.log('event: ', event);
        if (event.Code === 0) {
            this.snackBar.open(
                'Build Pipeline Created Succesfully',
                'Dismiss',
                {
                    duration: 5000,
                }
            );
            this.CloseDialog();
        } else {
            this.ErrorMessage = event.Message;
        }
    }

    public SaveProcessorDetails() {
        this.ProcessorDetailsFormControls.SaveProcessorDetails();
    }
}
