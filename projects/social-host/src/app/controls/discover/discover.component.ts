import { Component, OnInit } from '@angular/core';

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
                Image: 'https://www.fathym.com/img/screenshots/SocialUIDashboard.PNG',
                Description:
                    'Develop, automate, and manage modern web project delivery.',
                DocsLink: '/docs',
                HomeLink: '/dashboard',
            },
            {
                Name: 'IoT Ensemble',
                Icon: 'cloud_sync',
                Image: 'https://www.fathym.com/img/screenshots/IoTDashboard.PNG',
                Description:
                    'Connect devices, understand data and scale IoT applications.',
                DocsLink: '/iot/docs',
                HomeLink: '/dashboard/iot',
            },
            {
                Name: 'Habistack',
                Icon: 'storm',
                Image: 'https://www.fathym.com/img/screenshots/HabistackDashboard.PNG',
                Description:
                    'Simple, accurate weather forecasts for the world we live in.',
                DocsLink: '/forecast/docs',
                HomeLink: '/dashboard/forecast',
            },
            {
                Name: 'Proadject',
                Icon: 'local_car_wash',
                Image: 'https://www.fathym.com/img/screenshots/ProadjectDashboard.PNG',
                Description:
                    'Weather and road conditions for the routes we travel.',
                DocsLink: '/proadject/docs',
                HomeLink: 'https://www.proadject.com/',
            }
        );
    }

    public ngOnInit(): void {}
}
