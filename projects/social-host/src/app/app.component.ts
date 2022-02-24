import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LCUServiceSettings } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
} from '@lowcodeunit/applications-flow-common';
import {
  BreakpointObserver,
  BreakpointState
} from '@angular/cdk/layout';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public IsSmScreen: boolean;

  constructor(
    public breakpointObserver: BreakpointObserver,
    protected serviceSettings: LCUServiceSettings,
    protected eacSvc: EaCService,
    protected http: HttpClient,
    protected router: Router
  ) {
    router.events.subscribe((val) => {
      let changed = val instanceof NavigationEnd;
      if (changed) {
        if (this.State?.EaC) {
          this.eacSvc.LoadEnterpriseAsCode();
          this.getFeedInfo();
        }
      }
    });
  }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 959px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.IsSmScreen = true;
        } else {
          this.IsSmScreen = false;
        }
      });
    this.handleStateChange().then((eac) => {});
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await Promise.all([
      this.eacSvc.HasValidConnection(),
      this.eacSvc.EnsureUserEnterprise(),
    ]);

    await Promise.all([
      this.eacSvc.ListEnterprises(),
      this.eacSvc.GetActiveEnterprise(),
    ]);

    await this.getFeedInfo();
  }

  protected async getFeedInfo(): Promise<void> {
    await this.eacSvc.UserFeed(1, 25);
  }
}
