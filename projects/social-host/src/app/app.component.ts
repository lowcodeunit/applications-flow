import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LCUServiceSettings } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
  UserFeedResponseModel,
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

  public Feed: UserFeedResponseModel;

  // public FeedItems: MainFeedItemModel[];

  public LoadingFeed: boolean;
  constructor(
    protected serviceSettings: LCUServiceSettings,
    protected eacSvc: EaCService,
    protected http: HttpClient
  ) {
    this.Feed = new UserFeedResponseModel();
  }

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
    this.LoadingFeed = true;
    this.eacSvc.UserFeed(1, 25).subscribe((resp: UserFeedResponseModel) => {
      this.Feed = resp;
      this.LoadingFeed = false;
      //  console.log("FEED: ", this.Feed.Runs)
    });

    // }, 30000);
  }
}
