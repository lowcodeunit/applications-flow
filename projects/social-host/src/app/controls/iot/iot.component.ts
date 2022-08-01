import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

@Component({
    selector: 'lcu-iot',
    templateUrl: './iot.component.html',
    styleUrls: ['./iot.component.scss'],
})
export class IoTComponent implements OnInit {
    public Context: Object;

    public IoTConfig: LazyElementConfig;

    public IoTElementHTML: SafeHtml;

    public Loading: boolean;

    public State: ApplicationsFlowState;

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

        this.IoTElementHTML = this.sanitizer.bypassSecurityTrustHtml(
            `<${this.IoTConfig.ElementName}></${this.IoTConfig.ElementName}>`
        );
    }

    public ngOnInit(): void {
        this.eacSvc.State.subscribe((state: ApplicationsFlowState) => {
            this.State = state;

            this.Loading =
                this.State?.LoadingActiveEnterprise ||
                this.State?.LoadingEnterprises ||
                this.State?.Loading;
        });
    }

    //  Helpers
}
