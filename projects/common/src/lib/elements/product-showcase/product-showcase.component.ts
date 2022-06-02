import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-product-showcase',
    templateUrl: './product-showcase.component.html',
    styleUrls: ['./product-showcase.component.scss'],
})
export class ProductShowcaseComponent implements OnInit {
    constructor() {}

    public ngOnInit(): void {}

    public LaunchHabistack() {
        window.location.href = '/dashboard/forecast';
    }

    public LaunchIoT() {
        window.location.href = '/dashboard/iot';
    }

    public LaunchKrakyn() {
        window.location.href = '/dashboard/krakyn';
    }
}
