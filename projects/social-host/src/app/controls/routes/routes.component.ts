import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationsFlowState,
  EaCService,
  ApplicationsFlowService,
  NewApplicationDialogComponent
} from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {

  public get ActiveEnvironmentLookup(): string {
    //  TODO:  Eventually support multiple environments
    const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    return envLookups[0];
  }

  public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    return this.State?.EaC?.Applications || {};
  }

  public get ApplicationRoutes(): Array<string> {
    return Object.keys(this.RoutedApplications || {});
  }

  public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    this.Project?.ApplicationLookups.forEach((appLookup: string) => {
      apps[appLookup] = this.ApplicationsBank[appLookup];
    });
    return apps;
  }

  public get CurrentApplicationRoute(): any {
    return this.AppRoute || {};
  }

  public get CurrentRouteApplicationLookups(): Array<string> {
    return Object.keys(
      this.RoutedApplications[this.CurrentApplicationRoute] || {}
    );
  }

  public get Enterprise(): any {
    return this.State?.EaC?.Enterprise;
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public get NumberOfApps(): any {
    return this.CurrentRouteApplicationLookups?.length || {};
  }

  public get Project(): any {
    return this.State?.EaC?.Projects[this.ProjectLookup];
  }

  public get ProjectLookups(): string[] {
    return Object.keys(this.State?.EaC?.Projects || {});
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
        return app?.LookupConfig?.PathRegex.replace('.*', '');
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

          return wa?.LookupConfig?.PathRegex.startsWith(currentRouteBase);
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

  public AppRoute: string;

  public IsInfoCardEditable: boolean;

  public IsInfoCardShareable: boolean;

  public ProjectLookup: string;

  public Routes: any;

  public Slices: { [key: string]: number };

  public SlicesCount: number;

  public Stats: any[];

  constructor(
    protected appSvc: ApplicationsFlowService,
    protected activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
    protected router: Router,
    protected dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.AppRoute = params['appRoute'];
      this.ProjectLookup = params['projectLookup'];
    });

    this.Stats = [
      { Name: 'Retention Rate', Stat: '85%' },
      { Name: 'Bounce Rate', Stat: '38%' },
      { Name: 'Someother Rate', Stat: '5%' },
    ];

    this.IsInfoCardEditable = false;
    this.IsInfoCardShareable = false;
    
    this.SlicesCount = 5;

    this.Slices = {
      Applications: this.SlicesCount,
    };
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  public EditRouteClicked() {
    console.log('Edit Route clicked');
  }

  public HandleLeftClickEvent(event: any) {
    console.log('Left Icon has been selected', event);
  }

  public HandleRightClickEvent(event: any) {
    console.log('Right Icon has been selected', event);
    console.log(
      'app:',
      this.RoutedApplications[this.CurrentApplicationRoute][
        this.CurrentRouteApplicationLookups[0]
      ]
    );
  }
  
  public LaunchRouteClicked() {
    console.log('Launch Route clicked');
  }

  public OpenNewAppDialog(event: any){

    const dialogRef = this.dialog.open(NewApplicationDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      data: {
        projectLookup: this.ProjectLookup,
        currentRoute: this.AppRoute,
        environmentLookup: this.ActiveEnvironmentLookup,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // console.log("result:", result)
    });

  }

  public RouteToPath() {
    let path = '/dashboard/create-project?projectId=' + this.ProjectLookup;
    this.router.navigate([path]);
  }

  public SettingsClicked() {
    console.log('Settings Clicked');
  }

  public ToggleSlices(type: string) {
    let count = this.Slices[type];

    let length =
      type === 'Applications'
        ? this.NumberOfApps
        : this.SlicesCount;

    if (count === length) {
      this.Slices[type] = this.SlicesCount;
    } else {
      this.Slices[type] = length;
    }
  }

  public TrashRouteClicked() {
    console.log('Trash Route clicked');
  }

  public UpgradeClicked() {
    console.log('Upgarde clicked');
  }

  public UploadRouteClicked() {
    console.log('Upload Route clicked');
  }

  //HELPERS
  protected async handleStateChange(): Promise<void> {}
}
