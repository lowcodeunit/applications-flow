import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
        @Inject(MAT_DIALOG_DATA) public data: CDDialogData
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
}
