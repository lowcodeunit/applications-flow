import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-routes',
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
    protected get BuildRoutedApplications(): {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    } {
        const appLookups = Object.keys(this.Applications);

        const apps = appLookups.map(
            (appLookup) => this.Applications[appLookup]
        );

        let appRoutes =
            apps.map((app) => {
                // console.log("App from projects: ", app);
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

                    return wa?.LookupConfig?.PathRegex.startsWith(
                        currentRouteBase
                    );
                });

                routeMap[currentRouteBase] =
                    filteredAppLookups.reduce((prevAppMap, appLookup) => {
                        const appMap: any = {
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

        // console.log("App Routes: ",routeSetResult)

        return routeSetResult;
    }

    public ActiveEnvironmentLookup: string;

    public Applications: { [lookup: string]: EaCApplicationAsCode };

    public AppRoute: string;

    public ApplicationRoutes: Array<string>;

    public CurrentRouteApplicationLookups: Array<string>;

    public Enterprise: any;

    public Project: EaCProjectAsCode;

    public Projects: any;

    public ProjectLookup: string;

    public ProjectLookups: Array<string>;

    public Loading: boolean;

    public Routes: any;

    public RoutedApplications: {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    };
    public RouteSub: Subscription;

    public StateSub: Subscription;

    public State: ApplicationsFlowState;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected eacSvc: EaCService,
        protected router: Router
    ) {
        this.RouteSub = this.activatedRoute.params.subscribe((params: any) => {
            this.AppRoute = params['appRoute'];
            this.ProjectLookup = params['projectLookup'];
        });
    }

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                console.log('Routes state: ', this.State);

                if (this.State?.EaC?.Environments) {
                    //  TODO:  Eventually support multiple environments
                    const env =
                        Object.keys(this.State?.EaC?.Environments) || {};
                    this.ActiveEnvironmentLookup = env[0];
                }

                if (this.State?.EaC?.Projects) {
                    this.ProjectLookups = Object.keys(
                        this.State?.EaC?.Projects || {}
                    );
                    this.Projects = this.State?.EaC?.Projects;
                }

                if (this.State?.EaC?.Enterprise) {
                    this.Enterprise = this.State.EaC.Enterprise;
                }

                this.Project = this.State?.EaC?.Projects[this.ProjectLookup];

                if (
                    this.Project?.ApplicationLookups &&
                    this.State?.EaC?.Applications
                ) {
                    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

                    this.Project?.ApplicationLookups.forEach(
                        (appLookup: string) => {
                            apps[appLookup] =
                                this.State?.EaC?.Applications[appLookup];
                        }
                    );

                    this.Applications = apps;
                }

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;

                if (this.Applications) {
                    this.RoutedApplications = this.BuildRoutedApplications;

                    this.ApplicationRoutes =
                        Object.keys(this.BuildRoutedApplications) || [];

                    this.CurrentRouteApplicationLookups =
                        Object.keys(
                            this.BuildRoutedApplications[this.AppRoute]
                        ) || [];
                }
            }
        );
    }
}
