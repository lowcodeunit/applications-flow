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
    selector: 'lcu-discover',
    templateUrl: './discover.component.html',
    styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
    constructor() {}

    public ngOnInit(): void {}
}
