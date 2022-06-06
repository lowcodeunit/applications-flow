import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-product-accordion',
    templateUrl: './product-accordion.component.html',
    styleUrls: ['./product-accordion.component.scss'],
})
export class ProductAccordionComponent implements OnInit {
    constructor() {}

    public ngOnInit(): void {}

    public DiscoverMoreClicked() {
        window.location.href = '/dashboard/discover';
    }
}
