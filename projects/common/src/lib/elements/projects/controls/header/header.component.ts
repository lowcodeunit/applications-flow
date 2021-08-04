import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import {
  ApplicationsFlowState,
  ProjectState,
} from './../../../../state/applications-flow.state';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationsFlowEventsService } from './../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-projects-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  //  Fields

  //  Properties
  @Input('projects')
  public Projects: Array<ProjectState>;

  @Input('selected-project-id')
  public SelectedProjectID: string;

  //  Constructors
  public constructor(
    protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  //  Life Cycle
  public ngOnInit(): void {}

  //  API Methods
  public EnableCreatingProject(): void {
    this.appsFlowEventsSvc.SetCreatingProject(true);
  }

  //  Helpers
}
