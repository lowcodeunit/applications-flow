import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCHost, EaCProjectAsCode } from '@semanticjs/common';

export interface CDDialogData {
    hosts: { [lookup: string]: EaCHost };
    primaryHost: string;
    project: EaCProjectAsCode;
    projectLookup: string;
}

@Component({
    selector: 'lcu-custom-domain-dialog',
    templateUrl: './custom-domain-dialog.component.html',
    styleUrls: ['./custom-domain-dialog.component.scss'],
})
export class CustomDomainDialogComponent implements OnInit {
    public DomainData: {};

    constructor(
        public dialogRef: MatDialogRef<CustomDomainDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CDDialogData,
        protected snackBar: MatSnackBar
    ) {
        this.DomainData = {
            Hosts: this.data.hosts,
            PrimaryHost: this.data.primaryHost,
            Project: this.data.project,
            ProjectLookup: this.data.projectLookup,
        };
    }

    public ngOnInit(): void {}

    public CloseDialog() {
        this.dialogRef.close();
    }

    public HandleResultEvent(event: Status) {
        if (event.Code === 0) {
            this.snackBar.open('Custom Domain Succesfully Created', 'Dismiss', {
                duration: 5000,
            });
            this.CloseDialog();
        }
    }
}
