import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lcu-slotted-card',
  templateUrl: './slotted-card.component.html',
  styleUrls: ['./slotted-card.component.scss']
})
export class SlottedCardComponent implements OnInit {

  
  @Input('title') 
  public Title: string;

  @Input('icon') 
  public Icon: string;

  @Input('main-slot-description') 
  public MainSlotDescription: string;

  @Input('secondary-slot-description') 
  public SecondarySlotDescription: string;

  @Input('action-text') 
  public ActionText: string;

  @Input('action-path')
  public ActionPath: string;

  @Output('main-action-clicked') 
  public MainActionClicked: EventEmitter<{}>;


  constructor() { 
    this.MainActionClicked = new EventEmitter;
  }

  public ngOnInit(): void {
  }

  public MainActionClickEvent(){
    this.MainActionClicked.emit({});
  }

}
