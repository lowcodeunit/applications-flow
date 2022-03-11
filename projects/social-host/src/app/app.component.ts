import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LCUServiceSettings } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
} from '@lowcodeunit/applications-flow-common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected initialized: boolean;

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public IsSmScreen: boolean;

  constructor(
    public breakpointObserver: BreakpointObserver,
    protected serviceSettings: LCUServiceSettings,
    protected eacSvc: EaCService,
    protected http: HttpClient,
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
    router.events.subscribe((val: any) => {
      let changed = val instanceof NavigationEnd;
      if (changed && val.url != '/iot') {
        if (this.State?.EaC) {
          this.eacSvc.LoadEnterpriseAsCode();
          this.getFeedInfo();
        }
      } else if (val.url && val.url != '/iot' && !this.initialized) {
        this.handleStateChange().then((eac) => {});
        this.initialized = true;
      }

      console.log(val.url);
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
  }

  public ngAfterViewInit(): void {}

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await Promise.all([
      this.eacSvc.HasValidConnection(),
      this.eacSvc.EnsureUserEnterprise(),
    ]);

    await Promise.all([
      this.eacSvc.ListEnterprises(),
      this.eacSvc.GetActiveEnterprise(),
      this.getFeedInfo(),
    ]);

    // this.eacSvc.SetActiveEnterprise(this.State?.Enterprises[0].Lookup);
    console.log('state = ', this.State);
    // console.log("enterprise = ", this.State?.Enterprises)
  }

  protected async getFeedInfo(): Promise<void> {
    // console.log("Am I getting called???")
    await this.eacSvc.LoadUserFeed(1, 25);
  }
}
