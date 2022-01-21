import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-feed-card-sm',
  templateUrl: './feed-card-sm.component.html',
  styleUrls: ['./feed-card-sm.component.scss']
})
export class FeedCardSmComponent implements OnInit {

  @Input("icon")
  public Icon: string;

  @Input("title")
  public Title: string;

  @Input("subtext")
  public Subtext: string;

  @Input("description")
  public Description: string;

  public IconColor: string;

  constructor() { }

  ngOnInit(): void {
    this.determineIconColor();
  }

  //HELPERS
  protected determineIconColor(){
    if(this.Icon === "check_circle"){

      this.IconColor = "green";
    
    }
    else if(this.Icon === "cancel"){
      this.IconColor = "red";
    }
  }

}
