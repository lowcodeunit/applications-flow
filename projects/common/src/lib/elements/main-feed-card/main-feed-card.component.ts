import { Component, Input, OnInit } from '@angular/core';
import { FeedItem, FeedItemAction } from '../../models/user-feed.model';

@Component({
  selector: 'lcu-main-feed-card',
  templateUrl: './main-feed-card.component.html',
  styleUrls: ['./main-feed-card.component.scss'],
})
export class MainFeedCardComponent implements OnInit {
  @Input('feed-item')
  public FeedItem: FeedItem;

  constructor() {}

  public ngOnInit(): void {}

  public HandleAction(action: FeedItemAction) {
    console.log('Action clicked');
  }
}
