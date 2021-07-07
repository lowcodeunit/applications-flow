import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import {
  ApplicationsFlowState,
  ProjectState,
} from './../../../../state/applications-flow.state';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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

  //  Constructors
  public constructor() {}

  //  Life Cycle
  public ngOnInit(): void {}

  //  API Methods

  //  Helpers
}
