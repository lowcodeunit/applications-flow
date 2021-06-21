import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { ApplicationsFlowState } from './../../../../state/applications-flow.state';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lcu-projects-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public State: ApplicationsFlowState;

  protected stateChangeSubscription: Subscription;

  constructor(protected appsFlowSvc: ApplicationsFlowService) {

    // Listen for State changes
    this.stateChangeSubscription = this.appsFlowSvc.StateChanged
    .subscribe((state: ApplicationsFlowState) => {
     this.State = state;
    });
   }

  ngOnInit(): void {
  }
}
