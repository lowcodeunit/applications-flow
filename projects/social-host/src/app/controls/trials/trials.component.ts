import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
    ApplicationsFlowService,
    NewApplicationDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-trials',
    templateUrl: './trials.component.html',
    styleUrls: ['./trials.component.scss'],
})
export class TrialsComponent implements OnInit {
    constructor() {}

    public ngOnInit(): void {}
}
