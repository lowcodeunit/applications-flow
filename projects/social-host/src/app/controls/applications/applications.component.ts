import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from '@lcu/common';
import { ApplicationsFlowService } from 'projects/common/src/lib/services/applications-flow.service';
import {
  ApplicationsFlowState,
  EaCService,
  SaveApplicationAsCodeEventRequest,
} from '@lowcodeunit/applications-flow-common';
import {
  EaCApplicationAsCode,
  EaCEnvironmentAsCode,
  EaCSourceControl,
} from '@semanticjs/common';
import { EditApplicationFormComponent } from 'projects/common/src/lib/controls/edit-application-form/edit-application-form.component';
import { ProcessorDetailsFormComponent } from 'projects/common/src/lib/controls/processor-details-form/processor-details-form.component';
import { SecurityToggleComponent } from 'projects/common/src/lib/controls/security-toggle/security-toggle.component';
import { SourceControlFormComponent } from 'projects/common/src/lib/controls/source-control-form/source-control-form.component';
import { UserFeedResponseModel } from 'projects/common/src/lib/models/user-feed.model';
import { MatDialog } from '@angular/material/dialog';
import { EditApplicationDialogComponent } from 'projects/common/src/lib/dialogs/edit-application-dialog/edit-application-dialog.component';

@Component({
  selector: 'lcu-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  @ViewChild(EditApplicationFormComponent)
  public ApplicationFormControls: EditApplicationFormComponent;

  @ViewChild(SecurityToggleComponent)
  public SecurityToggleFormControls: SecurityToggleComponent;

  @ViewChild(SourceControlFormComponent)
  public SourceControlFormControls: SourceControlFormComponent;

  @ViewChild(ProcessorDetailsFormComponent)
  public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

  public get Application(): EaCApplicationAsCode {
    return this.State?.EaC?.Applications[this.ApplicationLookup] || {};
  }

  public get Applications(): any {
    return this.State?.EaC?.Applications;
  }

  public get ApplicationLookups(): Array<string> {
    return Object.keys(
      this.RoutedApplications[this.CurrentApplicationRoute] || {}
    );
  }

  public get Enterprise(): any {
    return this.State?.EaC?.Enterprise;
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[
      this.State?.EaC?.Enterprise?.PrimaryEnvironment
    ];
  }

  public get DefaultSourceControl(): EaCSourceControl {
    return {
      Organization: this.Application?.LowCodeUnit?.Organization,
      Repository: this.Application?.LowCodeUnit?.Repository,
    };
  }

  public get Project(): any {
    return this.State?.EaC?.Projects[this.ProjectLookup] || {};
  }

  public get Projects(): any {
    return this.State?.EaC?.Projects || {};
  }

  public get RoutedApplications(): {
    [route: string]: { [lookup: string]: EaCApplicationAsCode };
  } {
    const appLookups = Object.keys(this.Applications);

    const apps = appLookups.map((appLookup) => this.Applications[appLookup]);

    let appRoutes =
      apps.map((app) => {
        return app.LookupConfig?.PathRegex.replace('.*', '');
      }) || [];

    appRoutes = appRoutes.filter((ar) => ar != null);

    let routeBases: string[] = [];

    appRoutes.forEach((appRoute) => {
      const appRouteParts = appRoute.split('/');

      const appRouteBase = `/${appRouteParts[1]}`;

      if (routeBases.indexOf(appRouteBase) < 0) {
        routeBases.push(appRouteBase);
      }
    });

    let workingAppLookups = [...(appLookups || [])];

    routeBases = routeBases.sort((a, b) => b.localeCompare(a));

    const routeSet =
      routeBases.reduce((prevRouteMap, currentRouteBase) => {
        const routeMap = {
          ...prevRouteMap,
        };

        const filteredAppLookups = workingAppLookups.filter((wal) => {
          const wa = this.Applications[wal];

          return wa.LookupConfig?.PathRegex.startsWith(currentRouteBase);
        });

        routeMap[currentRouteBase] =
          filteredAppLookups.reduce((prevAppMap, appLookup) => {
            const appMap = {
              ...prevAppMap,
            };

            appMap[appLookup] = this.Applications[appLookup];

            return appMap;
          }, {}) || {};

        workingAppLookups = workingAppLookups.filter((wa) => {
          return filteredAppLookups.indexOf(wa) < 0;
        });

        return routeMap;
      }, {}) || {};

    let routeSetKeys = Object.keys(routeSet);

    routeSetKeys = routeSetKeys.sort((a, b) => a.localeCompare(b));

    const routeSetResult = {};

    routeSetKeys.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

    return routeSetResult;
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public ApplicationLookup: string;

  public CurrentApplicationRoute: string;

  public Feed: UserFeedResponseModel;

  public LoadingFeed: boolean;

  public Stats: any;

  public ProjectLookup: string;

  constructor(
    protected appSvc: ApplicationsFlowService,
    private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
    protected dialog: MatDialog,
  ) {
    this.Stats = [
      { Name: 'Retention Rate', Stat: '85%' },
      { Name: 'Bounce Rate', Stat: '38%' },
      { Name: 'Someother Rate', Stat: '5%' },
    ];

    this.activatedRoute.params.subscribe((params) => {
      this.ApplicationLookup = params['appLookup'];
      this.CurrentApplicationRoute = params['appRoute']
      this.ProjectLookup = params['projectLookup'];
    });
  }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => { });

    this.getFeedInfo();

  }

  //  API Methods

  

  public HandleLeftClickEvent(event: any) {
     this.OpenEditAppModal();

  }

  public HandleRightClickEvent(event: any) {}

  public HandleSaveFormEvent(formValue: any) {
    console.log('Recieved Save Event: ', formValue);
    // this.SaveApplication();
  }

  public OpenEditAppModal(){
    const dialogRef = this.dialog.open(EditApplicationDialogComponent, {
      width: '600px',
      data: {
        application: this.Application
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log("result:", result.event)
      this.SaveApplication(result.event);
    });
  }

  public UpgradeClicked() {}

  public SettingsClicked() {}

  public SaveApplication(appInfo: any): void {

    const app: EaCApplicationAsCode = this.Application;
    app.Application = {
      Name: appInfo.name,
      Description: appInfo.description,
      PriorityShift: this.Application?.Application?.PriorityShift || 0,
    };

    app.LookupConfig.PathRegex = `${appInfo.route}.*`;

    switch (app.Processor.Type) {
      case 'DFS':
        //will need to replace with this.RouteFormControl.value if other form added
        app.Processor.BaseHref =
          `${appInfo.route}/`.replace(
            '//',
            '/'
          );

        break;
    }

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  public SaveProcessorDetails(formValue: any): void {
    console.log('Recieved Save Event: ', formValue);

    const app: EaCApplicationAsCode = this.Application;
    app.LookupConfig.AllowedMethods =
      this.ProcessorDetailsFormControls.MethodsFormControl?.value
        ?.split(' ')
        .filter((v: string) => !!v);
    app.Processor.Type = this.ProcessorDetailsFormControls.ProcessorType;

    switch (app.Processor.Type) {
      case 'DFS':
        app.Processor.DefaultFile =
          this.ProcessorDetailsFormControls.DefaultFileFormControl.value ||
          'index.html';

        app.LowCodeUnit = {
          Type: this.ProcessorDetailsFormControls.LCUType,
        };

        switch (app.LowCodeUnit.Type) {
          case 'GitHub':
            app.LowCodeUnit.Organization =
              this.ProcessorDetailsFormControls.SourceControlFormControls.OrganizationFormControl.value;

            app.LowCodeUnit.Repository =
              this.ProcessorDetailsFormControls.SourceControlFormControls.RepositoryFormControl.value;

            app.LowCodeUnit.Build =
              this.ProcessorDetailsFormControls.BuildFormControl.value;

            app.LowCodeUnit.Path =
              this.ProcessorDetailsFormControls.SourceControlFormControls.BuildPathFormControl.value;
            break;

          case 'NPM':
            app.LowCodeUnit.Package =
              this.ProcessorDetailsFormControls.PackageFormControl.value;

            app.LowCodeUnit.Version =
              this.ProcessorDetailsFormControls.VersionFormControl.value;
            break;

          case 'WordPress':
            app.LowCodeUnit.APIRoot =
              this.ProcessorDetailsFormControls.APIRootFormControl.value;
            break;

          case 'Zip':
            app.LowCodeUnit.ZipFile =
              this.ProcessorDetailsFormControls.ZipFileFormControl.value;
            break;
        }
        break;

      case 'OAuth':
        app.Processor.Scopes =
          this.ProcessorDetailsFormControls.ScopesFormControl.value.split(' ');

        app.Processor.TokenLookup =
          this.ProcessorDetailsFormControls.TokenLookupFormControl.value;

        app.LowCodeUnit = {
          Type: this.ProcessorDetailsFormControls.LCUType,
        };

        switch (app.LowCodeUnit.Type) {
          case 'GitHubOAuth':
            app.LowCodeUnit.ClientID =
              this.ProcessorDetailsFormControls.ClientIDFormControl.value;

            app.LowCodeUnit.ClientSecret =
              this.ProcessorDetailsFormControls.ClientSecretFormControl.value;
            break;
        }
        break;

      case 'Proxy':
        app.Processor.InboundPath =
          this.ProcessorDetailsFormControls.InboundPathFormControl.value;

        app.LowCodeUnit = {
          Type: this.ProcessorDetailsFormControls.LCUType,
        };

        switch (app.LowCodeUnit.Type) {
          case 'API':
            app.LowCodeUnit.APIRoot =
              this.ProcessorDetailsFormControls.APIRootFormControl.value;

            app.LowCodeUnit.Security =
              this.ProcessorDetailsFormControls.SecurityFormControl.value;

            break;

          case 'SPA':
            app.LowCodeUnit.SPARoot =
              this.ProcessorDetailsFormControls.SPARootFormControl.value;
            break;
        }
        break;

      case 'Redirect':
        app.Processor.IncludeRequest =
          !!this.ProcessorDetailsFormControls.IncludeRequestFormControl.value;

        app.Processor.Permanent =
          !!this.ProcessorDetailsFormControls.PermanentFormControl.value;

        app.Processor.PreserveMethod =
          !!this.ProcessorDetailsFormControls.PreserveMethodFormControl.value;

        app.Processor.Redirect =
          this.ProcessorDetailsFormControls.RedirectFormControl.value;
        break;
    }

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  public SaveSecuritySettings(formValue: any): void {
    console.log('Recieved Save Event: ', formValue);

    const app: EaCApplicationAsCode = this.Application;

    app.LookupConfig.IsPrivate =
      this.SecurityToggleFormControls.IsPrivateFormControl.value;
    app.LookupConfig.IsTriggerSignIn = this.SecurityToggleFormControls
      .IsPrivateFormControl.value
      ? this.SecurityToggleFormControls.IsTriggerSignInFormControl.value
      : false;

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  //HELPERS

  protected async getFeedInfo(): Promise<void> {

    this.LoadingFeed = true;
     this.appSvc.UserFeed(1,25)
        .subscribe((resp: UserFeedResponseModel) => {
       this.Feed = resp;
       this.LoadingFeed = false;
       console.log("FEED: ", this.Feed.Runs)
     });



  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();
  }
}
