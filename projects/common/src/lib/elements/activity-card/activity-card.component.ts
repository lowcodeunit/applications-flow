import { Component, Input, OnInit } from '@angular/core';
import { FeedItem, FeedItemAction } from '../../models/user-feed.model';

@Component({
    selector: 'lcu-activity-card',
    templateUrl: './activity-card.component.html',
    styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {
    @Input('active-environment-lookup')
    public ActiveEnvironmentLookup: string;

    @Input('feed')
    public Feed: Array<FeedItem>;

    @Input('loading-feed')
    public LoadingFeed: boolean;

    @Input('filter-types')
    public FilterTypes: Array<string>;

    @Input('feed-check')
    public FeedCheck: any;

    @Input('source-control-lookup')
    public SourceControlLookup: string;

    @Input('has-gh-connection')
    public HasGHConnection: boolean;

    @Input('feed-header-actions')
    public FeedHeaderActions: Array<FeedItemAction>;

    constructor() {}

    ngOnInit(): void {}
}
