import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
  SaveApplicationAsCodeEventRequest,
  ApplicationsFlowService,
  EditApplicationFormComponent,
  ProcessorDetailsFormComponent,
  SecurityToggleComponent,
  SourceControlFormComponent,
  EditApplicationDialogComponent,
  ProcessorDetailsDialogComponent
} from '@lowcodeunit/applications-flow-common';
import {
  EaCApplicationAsCode,
  EaCEnvironmentAsCode,
  EaCSourceControl,
} from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';

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

  public get EnvironmentLookup(): string {
    //  TODO:  Eventually support multiple environments
    const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    return envLookups[0];
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

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.Environment?.Sources || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment?.Sources || {};
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public get Version(): string {
    let version;
    switch (this.Application?.LowCodeUnit?.Type) {
      case 'GitHub':
        
        version = this.Application.LowCodeUnit.Build;
        break;

      case 'NPM':

        version = this.Application.LowCodeUnit.Version;
        break;
    }
    return version;
  }

  public ApplicationLookup: string;

  public CurrentApplicationRoute: string;

  public IsInfoCardEditable: boolean;

  public IsInfoCardShareable: boolean;

  public Stats: any;

  public ProjectLookup: string;

  constructor(
    protected appSvc: ApplicationsFlowService,
    private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
    protected dialog: MatDialog
  ) {
    this.Stats = [
      { Name: 'Retention Rate', Stat: '85%' },
      { Name: 'Bounce Rate', Stat: '38%' },
      { Name: 'Someother Rate', Stat: '5%' },
    ];

    this.activatedRoute.params.subscribe((params) => {
      this.ApplicationLookup = params['appLookup'];
      this.CurrentApplicationRoute = params['appRoute'];
      this.ProjectLookup = params['projectLookup'];
    });

    this.IsInfoCardEditable = true;
    this.IsInfoCardShareable = false;
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  //  API Methods

  public HandleLeftClickEvent(event: any) {
    this.OpenEditAppModal();
  }

  public HandleRightClickEvent(event: any) {}

  public HandleSaveFormEvent(formValue: any) {
    // console.log('Recieved Save Event: ', formValue);
    // this.SaveApplication();
  }

  public OpenEditAppModal() {
    const dialogRef = this.dialog.open(EditApplicationDialogComponent, {
      width: '600px',
      data: {
        application: this.Application,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // console.log("result:", result.event)
    });
  }

  public OpenProcessorDetailsDialog(event: any){
    const dialogRef = this.dialog.open(ProcessorDetailsDialogComponent, {
      width: '600px',
      data: {
        applicationLookup: this.ApplicationLookup,
        environmentLookup: this.EnvironmentLookup,
        projectLookup: this.ProjectLookup
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // console.log("result:", result.event)
      // this.SaveApplication(result.event);
    });
  }

  public Unpack(): void {
    this.eacSvc.UnpackLowCodeUnit({
      ApplicationLookup: this.ApplicationLookup,
      ApplicationName: this.Application.Application?.Name,
      Version:
        this.Application.LowCodeUnit?.Version ||
        this.Application.LowCodeUnit?.Build,
    });
  }

  public UpgradeClicked() {}

  public SettingsClicked() {}


  public UpdateClicked(){
    
    
    if (confirm(`Do you want to update the package to ${this.Version}?`)) {
      this.UpdateToLatest();
      }
  }

  public UpdateToLatest(){

      const app: EaCApplicationAsCode = this.Application;
      switch (app.LowCodeUnit.Type) {
        case 'GitHub':
              
          app.LowCodeUnit.Build = 'latest';
          break;
  
        case 'NPM':
  
          app.LowCodeUnit.Version = 'latest';
              break;
          }
  
      const saveAppReq: SaveApplicationAsCodeEventRequest = {
        ProjectLookup: this.ProjectLookup,
        Application: app,
        ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
      };
  
      this.eacSvc.SaveApplicationAsCode(saveAppReq);
    

  }

  

  public SaveSecuritySettings(formValue: any): void {
    // console.log('Recieved Save Event: ', formValue);

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
  protected async handleStateChange(): Promise<void> {}
}
