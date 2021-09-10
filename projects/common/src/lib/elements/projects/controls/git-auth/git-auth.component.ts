import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { ApplicationsFlowState } from './../../../../state/applications-flow.state';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { BaseResponse } from '@lcu/common';

@Component({
  selector: 'lcu-git-auth',
  templateUrl: './git-auth.component.html',
  styleUrls: ['./git-auth.component.scss'],
})
export class GitAuthComponent implements OnInit, AfterViewInit {
  //  Properties
  public ConnectClicked: boolean;

  //  Constructors
  constructor() {}

  //  Life Cycle
  public ngAfterViewInit(): void {}

  public ngOnInit(): void {}

  /**
   * Connect Github Provider
   */
  public ConnectGitHubProvider(): void {
    const reidrectUri = location.pathname + location.search;

    window.location.href = `/.oauth/github?redirectUri=${reidrectUri}`;

    this.ConnectClicked = true;
  }

  /**
   * Listen for State changes
   */
}
