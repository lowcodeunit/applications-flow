import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LCUServiceSettings } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
} from '@lowcodeunit/applications-flow-common';


@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  constructor(
    protected serviceSettings: LCUServiceSettings,
    protected eacSvc: EaCService,
    protected http: HttpClient,
    protected router: Router) {
      

    }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
    
    this.router.events.subscribe((val) => {
      let changed = val instanceof NavigationEnd; 
      if(changed){
        this.eacSvc.LoadEnterpriseAsCode();
        this.getFeedInfo();
      }
    });
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.HasValidConnection();

    await this.eacSvc.EnsureUserEnterprise();

    await this.eacSvc.ListEnterprises();

    if (this.State.Enterprises?.length > 0) {
      await this.eacSvc.GetActiveEnterprise();
    }

    await this.getFeedInfo();
  }

  protected async getFeedInfo(): Promise<void> {
    this.State.LoadingFeed = true;

    await this.eacSvc.UserFeed(1, 25);
  }
}
