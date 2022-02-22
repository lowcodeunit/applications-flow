import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LCUServiceSettings } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
  UserFeedResponse,
} from '@lowcodeunit/applications-flow-common';
import {
  PalettePickerService,
  ThemeBuilderConstants,
  ThemeBuilderService,
  ThemePickerModel,
} from '@lowcodeunit/lcu-theme-builder-common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

declare var Sass: any;

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
    protected http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.HasValidConnection();

    await this.eacSvc.EnsureUserEnterprise();

    await this.eacSvc.ListEnterprises();

    if (this.State.Enterprises?.length > 0) {
      await this.eacSvc.GetActiveEnterprise();
    }
  }

  protected async getFeedInfo(): Promise<void> {
    // setInterval(() => {
    this.State.LoadingFeed = true;

    await this.eacSvc.UserFeed(1, 25);
    // }, 30000);
  }
}
