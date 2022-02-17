import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lcu-project-info-card',
  templateUrl: './project-info-card.component.html',
  styleUrls: ['./project-info-card.component.scss']
})
export class ProjectInfoCardComponent implements OnInit {
  
  @Input('description')
  public Description: string;
  
  @Input('image')
  public Image: string;

  @Input('is-editable')
  public IsEditable: boolean;

  @Input('loading')
  public Loading: boolean;

  @Input('name')
  public Name: string;

  @Input('subtext')
  public Subtext: string;

  @Output('left-click-event')
  public LeftClickEvent: EventEmitter<{}>;

  @Output('right-click-event')
  public RightClickEvent: EventEmitter<{}>;


  constructor() {
    this.LeftClickEvent = new EventEmitter();

    this.RightClickEvent = new EventEmitter();
   }

  public ngOnInit(): void {
    console.log("loading = ", this.Loading)
  }



  public LeftIconClicked(){
    this.LeftClickEvent.emit({});
  }

  public RightIconClicked(){
    this.RightClickEvent.emit({});
  }

}
