import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
    ApplicationsFlowService,
    NewApplicationDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import { LazyElementConfig, LazyElementToken } from '@lowcodeunit/lazy-element';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-iot',
    templateUrl: './iot.component.html',
    styleUrls: ['./iot.component.scss'],
})
export class IoTComponent implements OnInit {
    public Context: Object;

    public get Enterprise(): any {
        return this.State?.EaC?.Enterprise;
    }

    public IoTConfig: LazyElementConfig;

    public get IoTElementHTML(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            `<${this.IoTConfig.ElementName}></${this.IoTConfig.ElementName}>`
        );
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    //  Constructors
    constructor(
        protected sanitizer: DomSanitizer,
        protected eacSvc: EaCService
    ) {
        this.IoTConfig = {
            Scripts: [
                '/_lcu/lcu-device-data-flow-lcu/wc/lcu-device-data-flow.lcu.js',
            ],
            Styles: [
                '/_lcu/lcu-device-data-flow-lcu/wc/lcu-device-data-flow.lcu.css',
            ],
            ElementName: 'lcu-device-data-flow-manage-element',
        };
    }

    public ngOnInit(): void {
        this.handleStateChange().then((eac) => {});
    }

    //  Helpers
    protected async handleStateChange(): Promise<void> {}
}
