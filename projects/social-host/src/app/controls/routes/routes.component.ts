import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
    ApplicationsFlowService,
    NewApplicationDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';

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

    public IsInfoCardEditable: boolean;

    public IsInfoCardShareable: boolean;

    public Project: EaCProjectAsCode;

    public Projects: any;

    public ProjectLookup: string;

    public ProjectLookups: Array<string>;

    public Loading: boolean;

    public Routes: any;

    public RoutedApplications: {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    };

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    public Stats: any[];

    public State: ApplicationsFlowState;

    constructor(
        protected appSvc: ApplicationsFlowService,
        protected activatedRoute: ActivatedRoute,
        protected eacSvc: EaCService,
        protected router: Router,
        protected dialog: MatDialog
    ) {
        this.activatedRoute.params.subscribe((params: any) => {
            this.AppRoute = params['appRoute'];
            // if(this.AppRoute.charAt(0) !== '/'){
            //     this.AppRoute = '/'+this.AppRoute;
            // }
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
        this.eacSvc.State.subscribe((state: ApplicationsFlowState) => {
            this.State = state;

            // console.log("Routes state: ", this.State)

            if (this.State?.EaC?.Environments) {
                //  TODO:  Eventually support multiple environments
                const env = Object.keys(this.State?.EaC?.Environments) || {};
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
                    Object.keys(this.BuildRoutedApplications[this.AppRoute]) ||
                    [];
            }
        });
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
            this.BuildRoutedApplications[this.AppRoute][
                this.CurrentRouteApplicationLookups[0]
            ]
        );
    }

    public LaunchRouteClicked() {
        console.log('Launch Route clicked');
    }

    public OpenNewAppDialog(event: any) {
        const dialogRef = this.dialog.open(NewApplicationDialogComponent, {
            width: '600px',
            data: {
                projectLookup: this.ProjectLookup,
                currentRoute: this.AppRoute,
                environmentLookup: this.ActiveEnvironmentLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
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
                ? this.CurrentRouteApplicationLookups?.length
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
