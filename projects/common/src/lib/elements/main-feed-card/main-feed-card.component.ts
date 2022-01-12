import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-main-feed-card',
  templateUrl: './main-feed-card.component.html',
  styleUrls: ['./main-feed-card.component.scss']
})
export class MainFeedCardComponent implements OnInit {
  @Input('avatar')
  public Avatar: string;

  @Input('title')
  public Title: string;

  @Input('subtext')
  public Subtext: string;

  @Input('time-ago')
  public TimeAgo: string;

  constructor() { }

  public ngOnInit(): void {
  }

  public MoreClicked(){
    console.log("More clicked");
  }

}
