import { Component, Input, OnInit } from '@angular/core';
import { Advertisement } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-advertisement-card',
    templateUrl: './advertisement-card.component.html',
    styleUrls: ['./advertisement-card.component.scss'],
})
export class AdvertisementCardComponent implements OnInit {
    @Input('advertisement')
    public Advertisement: Advertisement;

    constructor() {}

    ngOnInit(): void {}

    public ActionClicked(action: string) {
        window.location.href = action;
    }
}
