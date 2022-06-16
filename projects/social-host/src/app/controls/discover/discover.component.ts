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
    public DiscoverItems: Array<any>;

    constructor() {
        this.DiscoverItems = Array<any>(
            {
                Name: 'Fathym',
                Icon: 'tap_and_play',
                Image: 'https://www.fathym.com/assets/images/screenshots/iot-ensemble-demo.png',
                Description:
                    'Develop, automate, and manage modern web project delivery.',
                DocsLink: '/docs',
                HomeLink: '/dashboard',
            },
            {
                Name: 'IoT Ensemble',
                Icon: 'cloud_sync',
                Image: 'https://www.fathym.com/assets/images/screenshots/iot-ensemble-demo.png',
                Description:
                    'Connect devices, understand data and scale IoT applications.',
                DocsLink: '/iot/docs',
                HomeLink: '/dashboard/iot',
            },
            {
                Name: 'Habistack',
                Icon: 'storm',
                Image: 'https://www.fathym.com/assets/images/screenshots/habistack-demo.png',
                Description:
                    'Simple, accurate weather forecasts for the world we live in.',
                DocsLink: '/forecast/docs',
                HomeLink: '/dashboard/forecast',
            },
            {
                Name: 'Proadject',
                Icon: 'local_car_wash',
                Image: 'https://www.fathym.com/assets/images/screenshots/proadject-demo.png',
                Description:
                    'Weather and road conditions for the routes we travel.',
                DocsLink: '/proadject/docs',
                HomeLink: 'https://www.proadject.com/',
            }
        );
    }

    public ngOnInit(): void {}
}
