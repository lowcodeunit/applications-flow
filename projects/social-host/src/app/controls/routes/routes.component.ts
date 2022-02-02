import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsFlowState, EaCService } from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    return this.State?.EaC?.Applications || {};
  }

  public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    this.Project?.ApplicationLookups.forEach((appLookup: string) => {
      apps[appLookup] = this.ApplicationsBank[appLookup];
    });
    return apps;
  }

  public get CurrentApplicationRoute(): any {
    return this.appRoute || {};
  }

  public get CurrentRouteApplicationLookups(): Array<string> {
    return Object.keys(
      this.RoutedApplications[this.CurrentApplicationRoute] || {}
    );
  }

  protected appRoute: string;

  public ProjectLookup: string;

  public Routes: any;

  public Stats: any[];

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public get NumberOfApps(): any {
    return this.CurrentRouteApplicationLookups.length || {};
  }

  public get Project(): any {
    return this.State?.EaC?.Projects[this.ProjectLookup];
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

  

  constructor(
    private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
    private router: Router
  ) {

    //  this.routeData = this.router.getCurrentNavigation().extras.state;

    this.activatedRoute.params.subscribe((params) => {
      this.appRoute = params['appRoute'];
      this.ProjectLookup = params['projectLookup'];
    });

    this.Stats = [
      { Name: 'Retention Rate', Stat: '85%' },
      { Name: 'Bounce Rate', Stat: '38%' },
      { Name: 'Someother Rate', Stat: '5%' },
    ];
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});

    console.log("app:", this.RoutedApplications[this.CurrentApplicationRoute][this.CurrentRouteApplicationLookups[0]])

    // console.log("route Data: ", this.routeData);
  }

  public LaunchRouteClicked() {
    console.log('Launch Route clicked');
  }

  public EditRouteClicked() {
    console.log('Edit Route clicked');
  }

  public UploadRouteClicked() {
    console.log('Upload Route clicked');
  }

  public TrashRouteClicked() {
    console.log('Trash Route clicked');
  }

  public HandleLeftClickEvent(event: any) {
    console.log('Left Icon has been selected', event);
  }

  public HandleRightClickEvent(event: any) {
    console.log('Right Icon has been selected', event);
    console.log("app:", this.RoutedApplications[this.CurrentApplicationRoute][this.CurrentRouteApplicationLookups[0]])
  }

  public SettingsClicked() {
    console.log('Settings Clicked');
  }

  public UpgradeClicked() {
    console.log('Upgarde clicked');
  }

  public RouteToPath(){
    let path = '/dashboard/create-project?projectId=' + this.ProjectLookup;
    this.router.navigate([path]);
  }

  //HELPERS

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();
  }
}
