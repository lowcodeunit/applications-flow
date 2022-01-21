import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardSlotModel } from '../../models/card-slot.model';
import { SlotActionModel } from '../../models/slot-action.model';

@Component({
  selector: 'lcu-column-info-card',
  templateUrl: './column-info-card.component.html',
  styleUrls: ['./column-info-card.component.scss']
})
export class ColumnInfoCardComponent implements OnInit {

  @Input('title') 
  public Title: string;

  @Input('main-icon') 
  public MainIcon: string;

  @Input('main-slot-description') 
  public MainSlotDescription: string;

  @Input('main-slots') 
  public MainSlots: Array<CardSlotModel>;

  @Input('secondary-slots') 
  public SecondarySlots: Array<CardSlotModel>;

  @Input('main-card-action') 
  public MainCardAction: SlotActionModel;

  @Output('main-card-clicked') 
  public MainCardClicked: EventEmitter<string>;

  @Output('slot-action-clicked') 
  public SlotActionClicked: EventEmitter<string>;

  constructor() { }

  ngOnInit(): void {
  }

  public SlotActionClickEvent(event: string){
    this.SlotActionClicked.emit(event);
  }

  public MainCardClickEvent(event: string){
    this.MainCardClicked.emit(event);
  }

}
