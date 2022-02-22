import { Component, Input, OnInit } from '@angular/core';
import { MainFeedModel } from '../../models/feed/main-feed.model';

@Component({
  selector: 'lcu-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.scss']
})
export class FeedCardComponent implements OnInit {

  private _feedData: MainFeedModel;
  @Input('feed-data')
  public set FeedData(val: MainFeedModel) {

    val.FeedItem.Avatar = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
    this._feedData = val;
  }

  public get FeedData(): MainFeedModel {
    return this._feedData;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
