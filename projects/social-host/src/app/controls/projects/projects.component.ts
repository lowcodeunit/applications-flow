import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApplicationsFlowState,
  EaCService,
} from '@lowcodeunit/applications-flow-common';
import { MainFeedItemModel } from 'projects/common/src/lib/models/main-feed-item.model';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { UserFeedResponseModel } from 'projects/common/src/lib/models/user-feed.model';
import { ApplicationsFlowService } from 'projects/common/src/lib/services/applications-flow.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomDomainDialogComponent } from 'projects/common/src/lib/dialogs/custom-domain-dialog/custom-domain-dialog.component';

@Component({
  selector: 'lcu-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public get ApplicationLookups(): string[] {
    return Object.keys(this.Project?.ApplicationLookups || {});
  }

  public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    return this.State?.EaC?.Applications || {};
  }

  public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    this.Project?.ApplicationLookups?.forEach((appLookup: string) => {
      apps[appLookup] = this.ApplicationsBank[appLookup];
    });
    return apps;
  }

  public get ApplicationRoutes(): Array<string> {
    return Object.keys(this.RoutedApplications || {});
  }

  public get Enterprise(): any {
    return this.State?.EaC?.Enterprise;
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public get Project(): any {
    return this.State?.EaC?.Projects[this.ProjectLookup] || {};
  }

  public get ProjectLookups(): string[] {
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get Projects(): any {
    return this.State?.EaC?.Projects || {};
  }

  public get NumberOfRoutes(): number {
    return this.ApplicationLookups.length;
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

  public Stats: any[];

  public ProjectLookup: string;

  public IsInfoCardEditable: boolean;

  public IsInfoCardShareable: boolean;

  constructor(
    protected appSvc: ApplicationsFlowService,
    private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
    protected dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.ProjectLookup = params['projectLookup'];
    });

    this.Stats = [
      { Name: 'Retention Rate', Stat: '85%' },
      { Name: 'Bounce Rate', Stat: '38%' },
      { Name: 'Someother Rate', Stat: '5%' },
    ];

    this.IsInfoCardEditable = false;
    this.IsInfoCardShareable = false;
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  public EditCustomDomain() {
    const dialogRef = this.dialog.open(CustomDomainDialogComponent, {
      width: '600px',
      data: {
        hosts: this.State.EaC.Hosts,
        primaryHost: this.State.EaC.Enterprise.PrimaryHost,
        project: this.Project,
        projectLookup: this.ProjectLookup,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The domains dialog was closed');
      // console.log("result:", result)
    });
  }

  public HandleLeftClickEvent(event: any) {
    console.log('Left Icon has been selected', event);
  }

  public HandleRightClickEvent(event: any) {
    console.log('Right Icon has been selected', event);
  }

  public SettingsClicked() {
    console.log('Settings Clicked');
  }

  public UpgradeClicked() {
    console.log('Upgarde clicked');
  }

  public LaunchBuildClicked() {
    console.log('launch build clicked');
  }

  public ViewBuildDetails() {
    console.log('View build details clicked');
  }

  //HELPERS
  protected async handleStateChange(): Promise<void> {}
}
