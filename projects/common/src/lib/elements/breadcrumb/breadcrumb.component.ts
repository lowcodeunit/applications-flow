import { Component, Input, OnInit } from '@angular/core';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
    @Input('application-lookup')
    public ApplicationLookup: string;

    @Input('enterprise')
    public Enterprise: any;

    @Input('enterprises')
    public Enterprises: Array<any>;

    @Input('loading')
    public Loading: boolean;

    @Input('projects')
    public Projects: any;

    @Input('project-lookup')
    public ProjectLookup: string;

    @Input('routed-application')
    public RoutedApplications: {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    };

    @Input('selected-route')
    public SelectedRoute: string;

    @Input('applications-bank')
    public ApplicationsBank: { [lookup: string]: EaCApplicationAsCode };

    // public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    //     return this.State?.EaC?.Applications || {};
    // }

    // public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    //     const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    //     this.SelectedProject?.ApplicationLookups?.forEach(
    //         (appLookup: string) => {
    //             apps[appLookup] = this.ApplicationsBank[appLookup];
    //         }
    //     );
    //     return apps;
    // }

    // public get SelectedApplication(): EaCApplicationAsCode {
    //     return this.State?.EaC?.Applications[this.ApplicationLookup] || {};
    // }

    // public get CurrentRouteApplicationLookups(): Array<string> {
    //     return Object.keys(this.RoutedApplications[this.SelectedRoute] || {});
    // }

    // public get Loading(): boolean {
    //     return (
    //         this.State?.LoadingActiveEnterprise ||
    //         this.State?.LoadingEnterprises ||
    // this.State?.Loading
    //     );
    // }

    // public get Projects(): any {
    //     return this.State?.EaC?.Projects || {};
    // }

    // public get ProjectLookups(): string[] {
    //     return Object.keys(this.State?.EaC?.Projects || {});
    // }

    // public get Routes(): Array<string> {
    //     return Object.keys(this.RoutedApplications || {});
    // }

    // public get RoutedApplications(): {
    //     [route: string]: { [lookup: string]: EaCApplicationAsCode };
    // } {
    //     const appLookups = Object.keys(this.Applications);

    //     const apps = appLookups.map(
    //         (appLookup) => this.Applications[appLookup]
    //     );

    //     let appRoutes =
    //         apps.map((app) => {
    //             return app?.LookupConfig?.PathRegex.replace('.*', '');
    //         }) || [];

    //     appRoutes = appRoutes.filter((ar) => ar != null);

    //     let routeBases: string[] = [];

    //     appRoutes?.forEach((appRoute) => {
    //         const appRouteParts = appRoute.split('/');

    //         const appRouteBase = `/${appRouteParts[1]}`;

    //         if (routeBases.indexOf(appRouteBase) < 0) {
    //             routeBases.push(appRouteBase);
    //         }
    //     });

    //     let workingAppLookups = [...(appLookups || [])];

    //     routeBases = routeBases.sort((a, b) => b.localeCompare(a));

    //     const routeSet =
    //         routeBases.reduce((prevRouteMap, currentRouteBase) => {
    //             const routeMap = {
    //                 ...prevRouteMap,
    //             };

    //             const filteredAppLookups = workingAppLookups.filter((wal) => {
    //                 const wa = this.Applications[wal];

    //                 return wa?.LookupConfig?.PathRegex.startsWith(
    //                     currentRouteBase
    //                 );
    //             });

    //             routeMap[currentRouteBase] =
    //                 filteredAppLookups.reduce((prevAppMap, appLookup) => {
    //                     const appMap = {
    //                         ...prevAppMap,
    //                     };

    //                     appMap[appLookup] = this.Applications[appLookup];

    //                     return appMap;
    //                 }, {}) || {};

    //             workingAppLookups = workingAppLookups.filter((wa) => {
    //                 return filteredAppLookups.indexOf(wa) < 0;
    //             });

    //             return routeMap;
    //         }, {}) || {};

    //     let routeSetKeys = Object.keys(routeSet);

    //     routeSetKeys = routeSetKeys.sort((a, b) => a.localeCompare(b));

    //     const routeSetResult = {};

    //     routeSetKeys?.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

    //     return routeSetResult;
    // }

    // public get SelectedProject(): any {
    //     return this.State?.EaC?.Projects[this.ProjectLookup] || {};
    // }

    public Applications: { [lookup: string]: EaCApplicationAsCode };

    public CurrentRouteApplicationLookups: Array<string>;

    public Routes: Array<string>;

    public SelectedProject: EaCProjectAsCode;

    public SkeletonEffect: string;

    public SelectedApplication: EaCApplicationAsCode;

    public ProjectLookups: Array<string>;

    constructor(protected eacSvc: EaCService) {
        this.SkeletonEffect = 'wave';
    }

    ngOnInit(): void {}

    ngOnChanges() {
        if (this.ApplicationsBank && this.ApplicationLookup) {
            this.SelectedApplication =
                this.ApplicationsBank[this.ApplicationLookup];
        }

        if (this.Projects) {
            this.ProjectLookups = Object.keys(this.Projects || {});

            if (this.ProjectLookup) {
                this.SelectedProject = this.Projects[this.ProjectLookup];
            }
        }

        if (this.RoutedApplications) {
            this.Routes = Object.keys(this.RoutedApplications || {});

            // console.log('routed apps: ', this.RoutedApplications);

            if (this.SelectedRoute) {
                // console.log('selected route: ', this.SelectedRoute)

                this.CurrentRouteApplicationLookups =
                    Object.keys(this.RoutedApplications[this.SelectedRoute]) ||
                    [];
            }
        }

        if (this.SelectedProject && this.ApplicationsBank) {
            this.Applications = {};

            this.SelectedProject?.ApplicationLookups?.forEach(
                (appLookup: string) => {
                    this.Applications[appLookup] =
                        this.ApplicationsBank[appLookup];
                }
            );
        }
    }

    public SetActiveEnterprise(entLookup: string): void {
        this.eacSvc.SetActiveEnterprise(entLookup).then(() => {});
    }

    // protected async handleStateChange(): Promise<void> {}
}
