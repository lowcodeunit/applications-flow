import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-skeleton-feed-card',
  templateUrl: './skeleton-feed-card.component.html',
  styleUrls: ['./skeleton-feed-card.component.scss']
})
export class SkeletonFeedCardComponent implements OnInit {

  public SkeletonEffect: string;

  constructor() { 
    this.SkeletonEffect = 'wave';
  }

  ngOnInit(): void {
  }

}
