import { Component, Input, OnInit } from '@angular/core';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input('application-lookup')
  public ApplicationLookup: string;

  

  public get Enterprise(): any {
    return this.State?.EaC?.Enterprise;
  }

  @Input('project-lookup')
  public ProjectLookup: string;

  @Input('selected-route')
  public SelectedRoute: string;

  public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    return this.State?.EaC?.Applications || {};
  }

  public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    this.SelectedProject?.ApplicationLookups?.forEach((appLookup: string) => {
      apps[appLookup] = this.ApplicationsBank[appLookup];
    });
    return apps;
  }

  public get SelectedApplication(): EaCApplicationAsCode {
    return this.State?.EaC?.Applications[this.ApplicationLookup] || {};
  }

  public get CurrentRouteApplicationLookups(): Array<string> {
    return Object.keys(this.RoutedApplications[this.SelectedRoute] || {});
  }

  public get Loading(): boolean {
    return (
      this.State?.LoadingActiveEnterprise || this.State?.LoadingEnterprises
    );
  }

  public get Projects(): any {
    return this.State?.EaC?.Projects || {};
  }

  public get ProjectLookups(): string[] {
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get Routes(): Array<string> {
    return Object.keys(this.RoutedApplications || {});
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

    appRoutes?.forEach((appRoute) => {
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

    routeSetKeys?.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

    return routeSetResult;
  }

  public get SelectedProject(): any {
    return this.State?.EaC?.Projects[this.ProjectLookup] || {};
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public SkeletonEffect: string;

  constructor(protected eacSvc: EaCService) {
    this.SkeletonEffect = 'wave';
  }

  ngOnInit(): void {
    this.handleStateChange().then((eac) => {});

    // console.log("state: ", this.State)

    console.log("selected enterprise: ", this.Enterprise)

    // console.log('Selected project: ', this.SelectedProject.Project);

    // console.log('SelectedRoute:', this.SelectedRoute);
  }

  public SetActiveEnterprise(entLookup: string): void {
    this.eacSvc.SetActiveEnterprise(entLookup).then(() => {});
  }

  protected async handleStateChange(): Promise<void> {}
}
