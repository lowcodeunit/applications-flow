import { Component, Input, OnInit } from '@angular/core';
import { FeedItem, FeedItemAction } from '../../models/user-feed.model';

@Component({
    selector: 'lcu-feed-card-sm',
    templateUrl: './feed-card-sm.component.html',
    styleUrls: ['./feed-card-sm.component.scss'],
})
export class FeedCardSmComponent implements OnInit {
    @Input('feed-item')
    public FeedItem: FeedItem;

    public IconColor: string;

    public Icon: string;

    constructor() {}

    //  Life Cycle
    public ngOnInit(): void {
        this.determineIcon();
    }

    //  API Methods
    public HandleAction(action: FeedItemAction) {
        // console.log('Action clicked');
    }

    //  Helpers
    protected determineIcon(): void {
        if (this.FeedItem.Status.Code === 0) {
            this.Icon = 'check_circle';

            this.IconColor = 'green';
        } else if (this.FeedItem.Status.Code === 1) {
            this.Icon = 'cancel';

            this.IconColor = 'red';
        } else if (this.FeedItem.Status.Code === 2) {
            this.Icon = 'sync';

            this.IconColor = 'blue';
        }
    }
}
