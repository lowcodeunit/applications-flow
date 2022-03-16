import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-analytics-card',
  templateUrl: './analytics-card.component.html',
  styleUrls: ['./analytics-card.component.scss']
})
export class AnalyticsCardComponent implements OnInit {

  @Input('title')
  public Title: string;

  @Input('subtext')
  public Subtext: string;

  // TODO update from any to an analytics model
  @Input('analytics')
  public Analytics: any[];


  constructor() {
    
   }

  ngOnInit(): void {
  }

}
