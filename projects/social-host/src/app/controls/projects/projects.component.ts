import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'lcu-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
    public get ActiveEnvironmentLookup(): string {
        //  TODO:  Eventually support multiple environments
        const envLookups = Object.keys(this.State?.EaC?.Environments || {});

        return envLookups[0];
    }

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

    public get Project(): EaCProjectAsCode {
        return this.State?.EaC?.Projects[this.ProjectLookup] || {};
    }

    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {});
    }

    public get Projects(): any {
        return this.State?.EaC?.Projects || {};
    }

    public get NumberOfRoutes(): number {
        return this.ApplicationRoutes?.length;
    }

    public get NumberOfModifiers(): number {
        return this.ProjectsModifierLookups?.length;
    }

    public get Modifiers(): { [lookup: string]: EaCDFSModifier } {
        return this.State?.EaC?.Modifiers || {};
    }

    public get ProjectsModifierLookups(): Array<string> {
        return this.Project.ModifierLookups || [];
    }

    public get RoutedApplications(): {
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

        // console.log("App Routes: ",routeSetResult)

        return routeSetResult;
    }

    public Slices: { [key: string]: number };

    public SlicesCount: number;

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

        dialogRef.afterClosed().subscribe((result) => {
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

        dialogRef.afterClosed().subscribe((result) => {
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
                ? this.NumberOfModifiers
                : type === 'Routes'
                ? this.NumberOfRoutes
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
