import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-product-discovery-card',
    templateUrl: './product-discovery-card.component.html',
    styleUrls: ['./product-discovery-card.component.scss'],
})
export class ProductDiscoveryCardComponent implements OnInit {
    constructor() {}

    public ngOnInit(): void {}

    public DiscoverMoreClicked() {
        window.location.href = '/dashboard/discover';
    }
}
