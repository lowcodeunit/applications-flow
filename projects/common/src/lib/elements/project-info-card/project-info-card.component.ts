import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

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

  @Input('is-shareable')
  public IsShareable: boolean;

  @Input('name')
  public Name: string;

  @Input('subtext')
  public Subtext: string;

  @Output('left-click-event')
  public LeftClickEvent: EventEmitter<{}>;

  @Output('right-click-event')
  public RightClickEvent: EventEmitter<{}>;

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public SkeletonEffect: string;


  constructor(protected eacSvc: EaCService) {
    this.LeftClickEvent = new EventEmitter();

    this.RightClickEvent = new EventEmitter();

    this.SkeletonEffect = 'wave';
   }

  public ngOnInit(): void {
    // console.log("loading = ", this.Loading)
    // console.log("is shareable: ", this.IsShareable);
    // console.log("is editable: ", this.IsEditable);
  }



  public LeftIconClicked(){
    this.LeftClickEvent.emit({});
  }

  public RightIconClicked(){
    console.log("share clicked")
    this.RightClickEvent.emit({});
  }

}
