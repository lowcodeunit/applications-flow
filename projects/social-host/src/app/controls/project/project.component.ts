import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
    ApplicationsFlowService,
} from '@lowcodeunit/applications-flow-common';
import {
    EaCApplicationAsCode,
    EaCProjectAsCode,
    Status,
} from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';
import { EaCDFSModifier } from '@semanticjs/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
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

    public ApplicationLookups: Array<string>;

    public Applications: { [lookup: string]: EaCApplicationAsCode };

    public ApplicationRoutes: Array<string>;

    public Enterprise: any;

    public FilterTypes: Array<string>;

    public Modifiers: { [lookup: string]: EaCDFSModifier };

    public Loading: boolean;

    public Project: EaCProjectAsCode;

    public Projects: any;

    public ProjectLookups: Array<string>;

    public ProjectsModifierLookups: Array<string>;

    public RoutedApplications: {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    };

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public Stats: any[];

    public ProjectLookup: string;

    public IsInfoCardEditable: boolean;

    public IsInfoCardShareable: boolean;

    constructor(
        protected appSvc: ApplicationsFlowService,
        private activatedRoute: ActivatedRoute,
        protected eacSvc: EaCService,
        protected dialog: MatDialog,
        protected router: Router
    ) {
        this.activatedRoute.params.subscribe((params: any) => {
            this.ProjectLookup = params['projectLookup'];
        });

        this.IsInfoCardEditable = true;
        this.IsInfoCardShareable = false;
    }

    ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                //  TODO:  Eventually support multiple environments
                this.ActiveEnvironmentLookup = Object.keys(
                    this.State?.EaC?.Environments || {}
                )[0];

                this.ApplicationLookups = Object.keys(
                    this.Project?.ApplicationLookups || {}
                );

                this.Project =
                    this.State?.EaC?.Projects[this.ProjectLookup] || {};

                const apps: { [lookup: string]: EaCApplicationAsCode } = {};

                this.Project?.ApplicationLookups?.forEach(
                    (appLookup: string) => {
                        apps[appLookup] =
                            this.State?.EaC?.Applications[appLookup];
                    }
                );
                this.Applications = apps;

                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                );

                this.Projects = this.State?.EaC?.Projects || {};

                this.RoutedApplications = this.BuildRoutedApplications;

                this.ApplicationRoutes = Object.keys(
                    this.RoutedApplications || {}
                );

                this.Enterprise = this.State?.EaC?.Enterprise;

                this.Modifiers = this.State?.EaC?.Modifiers || {};

                this.ProjectsModifierLookups =
                    this.Project.ModifierLookups || [];

                this.FilterTypes = Object.values(this.State?.FeedFilters || {});

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
    }
}
