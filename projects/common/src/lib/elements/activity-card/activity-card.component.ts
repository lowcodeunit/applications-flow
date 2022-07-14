import { Component, Input, OnInit } from '@angular/core';
import { FeedItem } from '../../models/user-feed.model';

@Component({
    selector: 'lcu-activity-card',
    templateUrl: './activity-card.component.html',
    styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {
    @Input('feed')
    public Feed: Array<FeedItem>;

    @Input('loading-feed')
    public LoadingFeed: boolean;

    @Input('filter-types')
    public FilterTypes: Array<string>;

    constructor() {}

    ngOnInit(): void {}
}
