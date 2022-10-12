import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
    ApplicationsFlowService,
    CustomDomainDialogComponent,
    NewApplicationDialogComponent,
    DFSModifiersDialogComponent,
    EditProjectDialogComponent,
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
    selector: 'lcu-projects-old',
    templateUrl: './projects-old.component.html',
    styleUrls: ['./projects-old.component.scss'],
})
export class ProjectsOldComponent implements OnInit, OnDestroy {
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

        this.Stats = [
            { Name: 'Retention Rate', Stat: '85%' },
            { Name: 'Bounce Rate', Stat: '38%' },
            { Name: 'Someother Rate', Stat: '5%' },
        ];

        this.IsInfoCardEditable = true;
        this.IsInfoCardShareable = false;

        this.SlicesCount = 5;

        this.Slices = {
            Routes: this.SlicesCount,
            Modifiers: this.SlicesCount,
        };
    }

    public ngOnInit(): void {
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

    public EditCustomDomain() {
        const dialogRef = this.dialog.open(CustomDomainDialogComponent, {
            width: '600px',
            data: {
                hosts: this.State.EaC.Hosts,
                primaryHost: this.Project?.PrimaryHost,
                project: this.Project,
                projectLookup: this.ProjectLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The domains dialog was closed');
            // console.log("result:", result)
        });
    }

    public DeleteProject(projectLookup: string, projectName: string): void {
        this.eacSvc
            .DeleteProject(projectLookup, projectName)
            .then((status: Status) => {
                this.router.navigate(['/enterprises']);
            });
    }

    public HandleLeftClickEvent(event: any) {
        this.OpenEditProjectModal();
    }

    public HandleRightClickEvent(event: any) {
        console.log('Right Icon has been selected', event);
    }

    public OpenEditProjectModal() {
        const dialogRef = this.dialog.open(EditProjectDialogComponent, {
            width: '600px',
            data: {
                projectLookup: this.ProjectLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result.event)
        });
    }

    public OpenNewAppDialog(event: any) {
        const dialogRef = this.dialog.open(NewApplicationDialogComponent, {
            width: '600px',
            data: {
                projectLookup: this.ProjectLookup,
                environmentLookup: this.ActiveEnvironmentLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public OpenModifierDialog(mdfrLookup: string, mdfrName: string) {
        // throw new Error('Not implemented: OpenModifierDialog');
        const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
            width: '600px',
            data: {
                modifierLookup: mdfrLookup,
                modifierName: mdfrName,
                projectLookup: this.ProjectLookup,
                level: 'project',
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
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
    public ToggleSlices(type: string) {
        let count = this.Slices[type];

        let length =
            type === 'Modifiers'
                ? this.ProjectsModifierLookups?.length
                : type === 'Routes'
                ? this.ApplicationRoutes?.length
                : this.SlicesCount;

        if (count === length) {
            this.Slices[type] = this.SlicesCount;
        } else {
            this.Slices[type] = length;
        }
    }

    public ViewBuildDetails() {
        console.log('View build details clicked');
    }

    //HELPERS
    protected async handleStateChange(): Promise<void> {}
}
