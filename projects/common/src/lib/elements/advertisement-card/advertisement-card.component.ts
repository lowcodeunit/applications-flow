import { Component, Input, OnInit } from '@angular/core';
import { Advertisement } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-advertisement-card',
    templateUrl: './advertisement-card.component.html',
    styleUrls: ['./advertisement-card.component.scss'],
})
export class AdvertisementCardComponent implements OnInit {
    @Input('advertisements')
    public Advertisements: Array<Advertisement>;

    public CurrentAd: Advertisement;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        // 900000 = 15 mins
        if (this.Advertisements?.length > 0) {
            console.log('Ads: ', this.Advertisements);
            let i = 0;
            this.CurrentAd = this.Advertisements[i];
            setInterval(() => {
                if (i + 1 > this.Advertisements?.length - 1) {
                    i = 0;
                } else {
                    i++;
                }

                this.CurrentAd = this.Advertisements[i];
                console.log('current ad = ', this.CurrentAd);
            }, 30000);
        }
    }

    public ActionClicked(action: string) {
        window.location.href = action;
    }
}
