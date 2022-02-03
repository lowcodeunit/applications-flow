import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsFlowState, EaCService } from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';


@Component({
  selector: 'lcu-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  public get Application(): any {
    return this.State?.EaC?.Applications[this.EditingApplicationLookup] || {};
  }

  public get Applications(): any {
    return this.State?.EaC?.Applications;
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment];
  }

  public get DefaultSourceControl(): EaCSourceControl {
    return {
      Organization: this.EditingApplication?.LowCodeUnit?.Organization,
      Repository: this.EditingApplication?.LowCodeUnit?.Repository,
    };
  }

  public get EditingApplication(): EaCApplicationAsCode {
    let app = this.Applications
      ? this.Applications[this.EditingApplicationLookup]
      : null;

    if (app == null && this.EditingApplicationLookup) {
      app = {};
    }

    return app;
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public EditingApplicationLookup: string;

  public ProcessorType: string;

  public Stats: any;

  public ProjectLookup: string;

  constructor(private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
  ) {

    this.Stats = [{ Name: "Retention Rate", Stat: "85%" },
    { Name: "Bounce Rate", Stat: "38%" },
    { Name: "Someother Rate", Stat: "5%" }];

    this.activatedRoute.params.subscribe(params => {
      this.EditingApplicationLookup = params['appLookup'];
      this.ProjectLookup = params['projectLookup'];
    });

  }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => { });

  }

  //  API Methods

  public HandleLeftClickEvent(event: any) {

  }

  public HandleRightClickEvent(event: any) {

  }

  public UpgradeClicked() {

  }

  public SettingsClicked() {

  }


  //HELPERS


  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();
  }







}
