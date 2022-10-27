import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from '@lcu/common';
import {
    ApplicationsFlowState,
    EaCService,
    SaveApplicationAsCodeEventRequest,
    ApplicationsFlowService,
    EditApplicationFormComponent,
    ProcessorDetailsFormComponent,
    SecurityToggleComponent,
    SourceControlFormComponent,
    EditApplicationDialogComponent,
    ProcessorDetailsDialogComponent,
    DFSModifiersDialogComponent,
    StateConfigDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
    EaCApplicationAsCode,
    EaCDataToken,
    EaCEnvironmentAsCode,
    EaCProjectAsCode,
    EaCSourceControl,
    Status,
} from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
    selector: 'lcu-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {
    @ViewChild(EditApplicationFormComponent)
    public ApplicationFormControls: EditApplicationFormComponent;

    @ViewChild(ProcessorDetailsFormComponent)
    public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

    @ViewChild(SecurityToggleComponent)
    public SecurityToggleFormControls: SecurityToggleComponent;

    @ViewChild(SourceControlFormComponent)
    public SourceControlFormControls: SourceControlFormComponent;

    public ErrorMessage: string;

    private get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    private get EnvironmentLookup(): string {
        //  TODO:  Eventually support multiple environments
        const envLookups = Object.keys(this.State?.EaC?.Environments || {});

        return envLookups[0];
    }

    private get NumberOfModifiers(): number {
        return this.ModifierLookups?.length;
    }

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

    private get StateConfig(): EaCDataToken {
        if (this.Project?.DataTokens['lcu-state-config']) {
            return this.Project?.DataTokens['lcu-state-config'];
        } else if (this.Application?.DataTokens['lcu-state-config']) {
            return this.Application?.DataTokens['lcu-state-config'];
        } else {
            return null;
        }
    }

    // private get Version(): string {
    //     let version;
    //     switch (this.Application?.LowCodeUnit?.Type) {
    //         case 'GitHub':
    //             version = this.Application?.LowCodeUnit?.Build;
    //             break;

    //         case 'NPM':
    //             version = this.Application?.LowCodeUnit?.Version;
    //             break;
    //     }
    //     return version;
    // }
    public AccessRights: any;

    public ActiveEnvironmentLookup: string;

    public Application: EaCApplicationAsCode;

    public Applications: {
        [lookup: string]: EaCApplicationAsCode;
    };

    public ApplicationLookup: string;

    public BPSub: Subscription;

    public CurrentApplicationRoute: string;

    public CurrentVersion: string;

    public FilterTypes: any;

    public IsInfoCardEditable: boolean;

    public IsInfoCardShareable: boolean;

    public IsSmScreen: boolean;

    public Loading: boolean;

    public LicenseConfigs: any;

    public ModifierLookups: Array<string>;

    public Project: EaCProjectAsCode;

    public RoutedApplications: {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    };

    public SkeletonEffect: string;

    public SourceControls: { [lookup: string]: EaCSourceControl };

    public SourceControlLookups: Array<string>;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public Stats: any;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    public ProjectLookup: string;

    public IsDisabled: boolean;

    public Version: string;

    constructor(
        protected appSvc: ApplicationsFlowService,
        private activatedRoute: ActivatedRoute,
        public breakpointObserver: BreakpointObserver,
        protected eacSvc: EaCService,
        protected dialog: MatDialog,
        protected router: Router,
        protected snackBar: MatSnackBar
    ) {
        this.Stats = [
            { Name: 'Retention Rate', Stat: '85%' },
            { Name: 'Bounce Rate', Stat: '38%' },
            { Name: 'Someother Rate', Stat: '5%' },
        ];

        this.activatedRoute.params.subscribe((params: any) => {
            // this.EntPath = params['enterprise'];
            this.ApplicationLookup = params['appLookup'];
            this.CurrentApplicationRoute = params['appRoute'];
            this.ProjectLookup = params['projectLookup'];
        });

        this.IsInfoCardEditable = false;
        this.IsInfoCardShareable = false;

        this.SkeletonEffect = 'wave';

        this.SlicesCount = 5;

        this.Slices = {
            Modifiers: this.SlicesCount,
        };

        this.IsDisabled = true;
    }

    public ngOnInit(): void {
        this.BPSub = this.breakpointObserver
            .observe(['(max-width: 959px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.IsSmScreen = true;
                } else {
                    this.IsSmScreen = false;
                }
                console.log('small: ', this.IsSmScreen);
            });
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                console.log('State: ', this.State);

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;

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

                if (this.Applications) {
                    this.RoutedApplications = this.BuildRoutedApplications;
                }

                this.Application =
                    this.State?.EaC?.Applications[this.ApplicationLookup] || {};

                let curVersion;
                switch (this.Application?.LowCodeUnit?.Type) {
                    case 'GitHub':
                        curVersion = `Build: ${this.Application.LowCodeUnit.Build}`;
                        break;

                    case 'NPM':
                        curVersion = `Version: ${this.Application.LowCodeUnit.Version}`;
                        break;
                }
                this.CurrentVersion = curVersion;

                switch (this.Application?.LowCodeUnit?.Type) {
                    case 'GitHub':
                        this.Version =
                            this.Application?.LowCodeUnit?.CurrentBuild;
                        break;

                    case 'NPM':
                        this.Version =
                            this.Application?.LowCodeUnit?.CurrentVersion;
                        break;
                }

                this.SourceControls = this.Environment?.Sources || {};

                this.SourceControlLookups = Object.keys(
                    this.Environment?.Sources || {}
                );

                this.AccessRights = Object.keys(
                    this.State?.EaC?.AccessRights || []
                );

                this.LicenseConfigs = Object.keys(
                    this.State?.EaC?.LicenseConfigurations || []
                );

                this.ModifierLookups = this.Application?.ModifierLookups || [];

                //  TODO:  Eventually support multiple environments
                const envLookups = Object.keys(
                    this.State?.EaC?.Environments || {}
                );

                this.ActiveEnvironmentLookup = envLookups[0];

                this.FilterTypes = Object.values(this.State?.FeedFilters || {});

                if (this.Application?.LookupConfig?.IsPrivate) {
                    this.HandleIsPrivateChanged(
                        this.Application?.LookupConfig?.IsPrivate
                    );
                }

                // if(this.Application?.LookupConfig?.IsPrivate){

                //     document.getElementById('app-form-card').style.height = '830px';
                //     document.getElementById('app-card-content').style.height = '690px';
                // }
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
    }

    //  API Methods

    public CancelEditApp() {
        this.ProcessorDetailsFormControls.SetupProcessorDetailsForm();
        this.ApplicationFormControls.ngOnChanges();
    }

    public DeleteApplication(appLookup: string, appName: string): void {
        this.eacSvc
            .DeleteApplication(appLookup, appName)
            .then((status: any) => {
                // if(status.Code === 0){
                this.router.navigate(['/project', this.ProjectLookup]);
                // }
            });
    }

    public ToggleEditForm() {
        // if(this.ApplicationFormControls.ApplicationFormGroup.disabled && this.ProcessorDetailsFormControls.ProcessorDetailsFormGroup.disabled){
        //   this.ApplicationFormControls.ApplicationFormGroup.enable();
        //   this.ProcessorDetailsFormControls.ProcessorDetailsFormGroup.enable();
        // }
        // else{
        //   this.ApplicationFormControls.ApplicationFormGroup.disable();
        //   this.ProcessorDetailsFormControls.ProcessorDetailsFormGroup.disable();
        // }
        this.IsDisabled = !this.IsDisabled;
    }

    public HandleIsPrivateChanged(isPrivate: boolean) {
        // this.TempIsPrivate = isPrivate;
        if (isPrivate) {
            // document.getElementById('app-form-card').style.height = '830px';
            // document.getElementById('app-card-content').style.height = '690px';
            document.getElementById('app-form-card').style.height = '960px';
            document.getElementById('app-card-content').style.height = '828px';
        } else {
            // document.getElementById('app-form-card').style.height = '650px';
            // document.getElementById('app-card-content').style.height = '515px';
            document.getElementById('app-form-card').style.height = '780px';
            document.getElementById('app-card-content').style.height = '648px';
        }
    }

    public HandleLeftClickEvent(event: any) {
        this.OpenEditAppModal();
    }

    public HandleRightClickEvent(event: any) {}

    public HandleSaveFormEvent(formValue: any) {
        // console.log('Recieved Save Event: ', formValue);
        // this.SaveApplication();
    }

    // public IsSaveDisabled(): boolean{
    //     let disabled: boolean;
    //     console.log(" pro valid = ",this.ProcessorDetailsFormControls
    //     ?.ProcessorDetailsFormGroup?.valid )
    //     console.log("app valid = ",
    // this.ApplicationFormControls?.ApplicationFormGroup
    //     ?.valid )

    //     console.log("dirty = ",(this.ProcessorDetailsFormControls
    //         ?.ProcessorDetailsFormGroup?.dirty ||
    //     this.ApplicationFormControls?.ApplicationFormGroup
    //         ?.dirty) )

    //     disabled = !((this.ProcessorDetailsFormControls
    //         ?.ProcessorDetailsFormGroup?.valid &&
    //     this.ApplicationFormControls?.ApplicationFormGroup
    //         ?.valid) &&
    //         (this.ProcessorDetailsFormControls
    //         ?.ProcessorDetailsFormGroup?.dirty ||
    //     this.ApplicationFormControls?.ApplicationFormGroup
    //         ?.dirty));
    //         console.log("dis = ", disabled);

    //     return !disabled;
    // }

    public OpenEditAppModal() {
        const dialogRef = this.dialog.open(EditApplicationDialogComponent, {
            width: '600px',
            data: {
                application: this.Application,
                applicationLookup: this.ApplicationLookup,
                projectLookup: this.ProjectLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result.event)
        });
    }

    public OpenProcessorDetailsDialog(event: any) {
        const dialogRef = this.dialog.open(ProcessorDetailsDialogComponent, {
            width: '600px',
            data: {
                applicationLookup: this.ApplicationLookup,
                environmentLookup: this.EnvironmentLookup,
                projectLookup: this.ProjectLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result.event)
            // this.SaveApplication(result.event);
        });
    }

    public Unpack(): void {
        this.eacSvc.UnpackLowCodeUnit({
            ApplicationLookup: this.ApplicationLookup,
            ApplicationName: this.Application.Application?.Name,
            Version:
                this.Application?.LowCodeUnit?.Version ||
                this.Application?.LowCodeUnit?.Build,
        });
    }

    public UpgradeClicked() {}

    public SettingsClicked() {}

    public UpdateClicked() {
        if (confirm(`Do you want to update the package to ${this.Version}?`)) {
            this.UpdatePackage();
        }
    }

    public UpdatePackage() {
        const app: EaCApplicationAsCode = this.Application;

        const saveAppReq: SaveApplicationAsCodeEventRequest = {
            ProjectLookup: this.ProjectLookup,
            Application: app,
            ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
        };

        this.eacSvc.SaveApplicationAsCode(saveAppReq);
    }

    public OpenModifierDialog(mdfrLookup: string, mdfrName: string) {
        const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
            width: '600px',
            data: {
                modifierLookup: mdfrLookup,
                modifierName: mdfrName,
                level: 'application',
                applicationLookup: this.ApplicationLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public OpenEditConfigDialog() {
        const dialogRef = this.dialog.open(StateConfigDialogComponent, {
            width: '600px',
            data: {
                appLookup: this.ApplicationLookup,
                config: this.StateConfig,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public SaveConnectedSource(formValue: {
        sourceControlLookup: string;
    }): void {
        // console.log('Recieved Save Event: ', formValue);

        const app: EaCApplicationAsCode = this.Application;

        app.LowCodeUnit.SourceControlLookup = formValue.sourceControlLookup;

        const saveAppReq: SaveApplicationAsCodeEventRequest = {
            ProjectLookup: this.ProjectLookup,
            Application: app,
            ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
        };

        this.eacSvc.SaveApplicationAsCode(saveAppReq);
    }

    public SaveSecuritySettings(formValue: any): void {
        // console.log('Recieved Save Event: ', formValue);

        const app: EaCApplicationAsCode = this.Application;

        app.LookupConfig.IsPrivate =
            this.SecurityToggleFormControls.IsPrivateFormControl.value;
        app.LookupConfig.IsTriggerSignIn = this.SecurityToggleFormControls
            .IsPrivateFormControl.value
            ? this.SecurityToggleFormControls.IsTriggerSignInFormControl.value
            : false;
        // console.log("ARL: ", this.SecurityToggleFormControls.AccessRightsFormControl.value);
        app.AccessRightLookups =
            this.SecurityToggleFormControls.AccessRightsFormControl.value;
        // console.log("LCL: ", this.SecurityToggleFormControls.LicenseConfigsFormControl.value);

        app.LicenseConfigurationLookups =
            this.SecurityToggleFormControls.LicenseConfigsFormControl.value;

        if (!app.LookupConfig.PathRegex.startsWith('/')) {
            app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
        }

        const saveAppReq: SaveApplicationAsCodeEventRequest = {
            ProjectLookup: this.ProjectLookup,
            Application: app,
            ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
        };

        this.eacSvc.SaveApplicationAsCode(saveAppReq);
    }

    public ToggleSlices(type: string) {
        let count = this.Slices[type];

        let length =
            type === 'Modifiers' ? this.NumberOfModifiers : this.SlicesCount;

        if (count === length) {
            this.Slices[type] = this.SlicesCount;
        } else {
            this.Slices[type] = length;
        }
    }

    public HandleSaveApplicationEvent(event: Status) {
        console.log('event to save: ', event);
        if (event.Code === 0) {
            this.snackBar.open('Application Succesfully Updated', 'Dismiss', {
                duration: 5000,
            });
        } else {
            this.ErrorMessage = event.Message;
        }
    }

    // public SaveApplication() {
    //   this.ApplicationFormControls.SaveApplication()
    // }
    public SaveApplication(): void {
        const app: EaCApplicationAsCode = {
            Application: {
                Name: this.ApplicationFormControls.NameFormControl.value,
                Description:
                    this.ApplicationFormControls.DescriptionFormControl.value,
                PriorityShift: 0,
            },
            // AccessRightLookups: [],
            // DataTokens: {},
            // LicenseConfigurationLookups: [],
            LookupConfig: {
                PathRegex: `${this.ApplicationFormControls.RouteFormControl.value}.*`,
                // QueryRegex: '',
                // HeaderRegex: '',
                AllowedMethods:
                    this.ProcessorDetailsFormControls.MethodsFormControl?.value
                        ?.split(' ')
                        .filter((v: string) => !!v),
            },
            Processor: {
                Type: this.ProcessorDetailsFormControls.ProcessorType,
            },
            // LowCodeUnit: {},
        };

        switch (app.Processor.Type) {
            case 'DFS':
                app.Processor.BaseHref =
                    `${this.ApplicationFormControls.RouteFormControl.value}/`.replace(
                        '//',
                        '/'
                    );

                app.Processor.DefaultFile =
                    this.ProcessorDetailsFormControls.DefaultFileFormControl
                        .value || 'index.html';

                app.LowCodeUnit = {
                    Type: this.ProcessorDetailsFormControls.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'GitHub':
                        app.LowCodeUnit.Organization =
                            this.SourceControls[
                                this.ProcessorDetailsFormControls.SourceControlFormControl.value
                            ].Organization;

                        app.LowCodeUnit.Repository =
                            this.SourceControls[
                                this.ProcessorDetailsFormControls.SourceControlFormControl.value
                            ].Repository;

                        app.LowCodeUnit.Build =
                            this.ProcessorDetailsFormControls.BuildFormControl.value;

                        app.LowCodeUnit.Path =
                            this.ProcessorDetailsFormControls.BuildPathFormControl.value;
                        break;

                    case 'NPM':
                        app.LowCodeUnit.Package =
                            this.ProcessorDetailsFormControls.PackageFormControl.value;

                        app.LowCodeUnit.Version =
                            this.ProcessorDetailsFormControls.VersionFormControl.value;
                        break;

                    case 'Zip':
                        app.LowCodeUnit.ZipFile =
                            this.ProcessorDetailsFormControls.ZipFileFormControl.value;
                        break;
                }
                break;

            case 'OAuth':
                app.Processor.Scopes =
                    this.ProcessorDetailsFormControls.ScopesFormControl.value.split(
                        ' '
                    );

                app.Processor.TokenLookup =
                    this.ProcessorDetailsFormControls.TokenLookupFormControl.value;

                app.LowCodeUnit = {
                    Type: this.ProcessorDetailsFormControls.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'GitHubOAuth':
                        app.LowCodeUnit.ClientID =
                            this.ProcessorDetailsFormControls.ClientIDFormControl.value;

                        app.LowCodeUnit.ClientSecret =
                            this.ProcessorDetailsFormControls.ClientSecretFormControl.value;
                        break;
                }
                break;

            case 'Proxy':
                app.Processor.InboundPath =
                    this.ProcessorDetailsFormControls.InboundPathFormControl.value;

                app.LowCodeUnit = {
                    Type: this.ProcessorDetailsFormControls.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'API':
                        app.LowCodeUnit.APIRoot =
                            this.ProcessorDetailsFormControls.APIRootFormControl.value;

                        app.LowCodeUnit.Security =
                            this.ProcessorDetailsFormControls.SecurityFormControl.value;

                        break;

                    case 'SPA':
                        app.LowCodeUnit.SPARoot =
                            this.ProcessorDetailsFormControls.SPARootFormControl.value;
                        break;
                }
                break;

            case 'Redirect':
                app.Processor.Permanent =
                    !!this.ProcessorDetailsFormControls.PermanentFormControl
                        .value;

                app.Processor.PreserveMethod =
                    !!this.ProcessorDetailsFormControls
                        .PreserveMethodFormControl.value;

                app.Processor.Redirect =
                    this.ProcessorDetailsFormControls.RedirectFormControl.value;
                break;
        }

        if (!app.LookupConfig.PathRegex.startsWith('/')) {
            app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
        }

        const saveAppReq: SaveApplicationAsCodeEventRequest = {
            ProjectLookup: this.ProjectLookup,
            Application: app,
            ApplicationLookup: this.ApplicationLookup,
        };
        // this.HasBuildFormControl.value &&  taken out from below if statement
        if (
            this.ProcessorDetailsFormControls.ProcessorType !== 'redirect' &&
            this.ProcessorDetailsFormControls.LCUType === 'GitHub'
        ) {
            if (app) {
                app.LowCodeUnit.SourceControlLookup =
                    this.ProcessorDetailsFormControls.SourceControlFormControl.value;
            }
        } else if (app) {
            app.LowCodeUnit.SourceControlLookup = null;
        }

        // console.log("Save new App request: ", saveAppReq);

        this.eacSvc.SaveApplicationAsCode(saveAppReq).then((res: any) => {
            this.HandleSaveApplicationEvent(res);
        });
    }

    //HELPERS
    protected async handleStateChange(): Promise<void> {}
}
