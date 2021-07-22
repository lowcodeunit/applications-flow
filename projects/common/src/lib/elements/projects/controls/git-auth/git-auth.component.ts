import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { ApplicationsFlowState } from './../../../../state/applications-flow.state';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseResponse } from '@lcu/common';

@Component({
  selector: 'lcu-git-auth',
  templateUrl: './git-auth.component.html',
  styleUrls: ['./git-auth.component.scss']
})
export class GitAuthComponent implements OnInit, AfterViewInit {

  public State: ApplicationsFlowState;

  constructor(protected appsFlowSvc: ApplicationsFlowService) {
    this.State = new ApplicationsFlowState();
   }

  //  Life Cycle
  public ngAfterViewInit(): void {
    this.handleStateChange();
  }

  public ngOnInit(): void {
  }

  /**
   * Connect Github Provider
   */
  public ConnectGitHubProvider(): void {
    const reidrectUri = location.pathname + location.search;

    window.location.href = `/.oauth/github?redirectUri=${reidrectUri}`;
  }

  /**
   * Listen for State changes
   */
  protected handleStateChange(): void {
    this.State.Loading = true;

    // move this into github control thing - shannon
    this.appsFlowSvc
      .HasValidConnection()
      .subscribe((response: BaseResponse) => {
        this.State.GitHub.HasConnection = response.Status.Code === 0;

       // this.determineStep();

        if (this.State.GitHub.HasConnection) {
         // this.listOrganizations();
        } else {
          this.State.Loading = false;
        }
      });
  }

}
