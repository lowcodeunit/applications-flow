import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    EaCService,
    SaveApplicationAsCodeEventRequest,
} from '../../../../../services/eac.service';
import {
    EaCApplicationAsCode,
    EaCEnvironmentAsCode,
    EaCProjectAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { Guid } from '@lcu/common';
import { MatSelectChange } from '@angular/material/select';
import { SourceControlFormControlsComponent } from '../../forms/source-control/source-control.component';
import { ApplicationsFlowService } from '../../../../../services/applications-flow.service';

@Component({
    selector: 'lcu-apps-flow',
    templateUrl: './apps-flow.component.html',
    styleUrls: ['./apps-flow.component.scss'],
})
export class AppsFlowComponent implements OnInit {
    //  Fields

    //  Properties
    public get APIRootFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.apiRoot;
    }

    public ApplicationFormGroup: FormGroup;

    public get ApplicationIDFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.applicationId;
    }

    public get ApplicationLookups(): Array<string> {
        return Object.keys(this.Applications || {});
    }

    public get ApplicationRoutes(): Array<string> {
        return Object.keys(this.RoutedApplications || {});
    }

    public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
        return this.Data?.Applications || {};
    }

    public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
        const apps: { [lookup: string]: EaCApplicationAsCode } = {};

        this.Project.ApplicationLookups.forEach((appLookup) => {
            apps[appLookup] = this.ApplicationsBank[appLookup];
        });
        return apps;
    }

    public get BuildFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.build;
    }

    public get ClientIDFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.clientId;
    }

    public get ClientSecretFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.clientSecret;
    }

    public CurrentApplicationRoute: string;

    public get CurrentRouteApplicationLookups(): Array<string> {
        return Object.keys(
            this.RoutedApplications[this.CurrentApplicationRoute] || {}
        );
    }

    @Input('data')
    public Data: {
        Applications: { [lookup: string]: EaCApplicationAsCode };
        Environment: EaCEnvironmentAsCode;
        PrimaryHost: string;
        Project: EaCProjectAsCode;
        ProjectLookup: string;
    };

    public get DefaultFileFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.defaultFile;
    }

    public get DefaultSourceControl(): EaCSourceControl {
        return {
            Organization: this.EditingApplication?.LowCodeUnit?.Organization,
            Repository: this.EditingApplication?.LowCodeUnit?.Repository,
        };
    }

    public get DescriptionFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.description;
    }

    public get EditingApplication(): EaCApplicationAsCode {
        let app = this.Applications
            ? this.Applications[this.EditingApplicationLookup]
            : null;

        if (app == null && this.EditingApplicationLookup) {
            app = {};
        }

        return app;
    }

    public EditingApplicationLookup: string;

    public get HasBuildFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.hasBuild;
    }

    public get InboundPathFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.inboundPath;
    }

    public get IsPrivateFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.isPrivate;
    }

    public get IsTriggerSignInFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.isTriggerSignIn;
    }

    public LCUType: string;

    public get MethodsFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.methods;
    }

    public get NameFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.name;
    }

    public get PackageFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.package;
    }

    public IsPermanent: boolean;

    public IsPreserve: boolean;

    public redirectTooltip: string;

    public get PermanentFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.permanent;
    }

    public get PreserveMethodFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.preserveMethod;
    }

    public get PrimaryHost(): string {
        return this.Data.PrimaryHost;
    }

    public ProcessorType: string;

    public get Project(): EaCProjectAsCode {
        return this.Data.Project;
    }

    public get ProjectLookup(): string {
        return this.Data.ProjectLookup;
    }

    public get RedirectFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.redirect;
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

        return routeSetResult;
    }

    public get RouteFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.route;
    }

    public get ScopesFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.scopes;
    }

    public get SecurityFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.security;
    }

    @ViewChild(SourceControlFormControlsComponent)
    public SourceControlFormControls: SourceControlFormControlsComponent;

    public get SourceControlLookupFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.sourceControlLookup;
    }

    public get SourceControlLookups(): Array<string> {
        return Object.keys(this.SourceControls || {});
    }

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Data.Environment.Sources || {};
    }

    public get SPARootFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.spaRoot;
    }

    public get TokenLookupFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.tokenLookup;
    }

    public get VersionFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.version;
    }

    public get ZipFileFormControl(): AbstractControl {
        return this.ApplicationFormGroup?.controls.zipFile;
    }

    //  Constructors
    constructor(
        protected formBldr: FormBuilder,
        protected appsFlowSvc: ApplicationsFlowService,
        protected eacSvc: EaCService
    ) {
        this.EditingApplicationLookup = null;
        this.redirectTooltip = '';

        // this.IsPermanent = false;

        // this.IsPreserve = false;
    }

    //  Life Cycle
    public ngOnInit(): void {
        if (this.ApplicationLookups?.length <= 0) {
            this.CreateNewApplication();
        }
    }

    //  API Methods
    public CreateNewApplication(): void {
        this.SetEditingApplication(Guid.CreateRaw());
    }

    public DeleteApplication(appLookup: string, appName: string): void {
        this.eacSvc.DeleteApplication(appLookup, appName);
    }

    public LCUTypeChanged(event: MatSelectChange): void {
        this.LCUType = event.value;

        this.setupLcuTypeSubForm();
    }

    public ProcessorTypeChanged(event: MatSelectChange): void {
        this.ProcessorType = event.value;

        this.setupProcessorTypeSubForm();
    }

    public DetermineTooltipText() {
        let permanentValue = this.PermanentFormControl.value;
        let preserveValue = this.PreserveMethodFormControl.value;

        if (permanentValue === true && preserveValue === false) {
            this.redirectTooltip = '301 – Permanent and Not Preserve';
        } else if (permanentValue === false && preserveValue === false) {
            this.redirectTooltip = '302 – Not Permanent and Not Preserve';
        } else if (permanentValue === false && preserveValue === true) {
            this.redirectTooltip = '307 – Not Permanent and Preserve';
        } else if (permanentValue === true && preserveValue === true) {
            this.redirectTooltip = '308 – Permanent and Preserve';
        }
    }

    public GetProcessorType(appLookup: any): string {
        let processorType = '';
        processorType = this.Applications[appLookup].Processor.Type
            ? this.Applications[appLookup].Processor.Type
            : '';
        // console.log("Ptype = ", processorType);

        return processorType;
    }

    public EditApplicationRouteClicked(appRoute: any) {
        this.CurrentApplicationRoute = appRoute;
    }

    public SaveApplication(): void {
        const app: EaCApplicationAsCode = {
            Application: {
                Name: this.NameFormControl.value,
                Description: this.DescriptionFormControl.value,
                PriorityShift:
                    this.EditingApplication?.Application?.PriorityShift || 0,
            },
            AccessRightLookups: [],
            DataTokens: {},
            LicenseConfigurationLookups: [],
            LookupConfig: {
                IsPrivate: this.IsPrivateFormControl.value,
                IsTriggerSignIn: this.IsPrivateFormControl.value
                    ? this.IsTriggerSignInFormControl.value
                    : false,
                PathRegex: `${this.RouteFormControl.value}.*`,
                QueryRegex:
                    this.EditingApplication?.LookupConfig?.QueryRegex || '',
                HeaderRegex:
                    this.EditingApplication?.LookupConfig?.HeaderRegex || '',
                AllowedMethods: this.MethodsFormControl?.value
                    ?.split(' ')
                    .filter((v: string) => !!v),
            },
            Processor: {
                Type: this.ProcessorType,
            },
        };

        switch (app.Processor.Type) {
            case 'DFS':
                app.Processor.BaseHref =
                    `${this.RouteFormControl.value}/`.replace('//', '/');

                app.Processor.DefaultFile =
                    this.DefaultFileFormControl.value || 'index.html';

                app.LowCodeUnit = {
                    Type: this.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'GitHub':
                        app.LowCodeUnit.Organization =
                            this.SourceControlFormControls.OrganizationFormControl.value;

                        app.LowCodeUnit.Repository =
                            this.SourceControlFormControls.RepositoryFormControl.value;

                        app.LowCodeUnit.Build = this.BuildFormControl.value;

                        app.LowCodeUnit.Path =
                            this.SourceControlFormControls.BuildPathFormControl.value;
                        break;

                    case 'NPM':
                        app.LowCodeUnit.Package = this.PackageFormControl.value;

                        app.LowCodeUnit.Version = this.VersionFormControl.value;
                        break;

                    case 'Zip':
                        app.LowCodeUnit.ZipFile = this.ZipFileFormControl.value;
                        break;
                }
                break;

            case 'OAuth':
                app.Processor.Scopes = this.ScopesFormControl.value.split(' ');

                app.Processor.TokenLookup = this.TokenLookupFormControl.value;

                app.LowCodeUnit = {
                    Type: this.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'GitHubOAuth':
                        app.LowCodeUnit.ClientID =
                            this.ClientIDFormControl.value;

                        app.LowCodeUnit.ClientSecret =
                            this.ClientSecretFormControl.value;
                        break;
                }
                break;

            case 'Proxy':
                app.Processor.InboundPath = this.InboundPathFormControl.value;

                app.LowCodeUnit = {
                    Type: this.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'API':
                        app.LowCodeUnit.APIRoot = this.APIRootFormControl.value;

                        app.LowCodeUnit.Security =
                            this.SecurityFormControl.value;

                        break;

                    case 'SPA':
                        app.LowCodeUnit.SPARoot = this.SPARootFormControl.value;
                        break;
                }
                break;

            case 'Redirect':
                app.Processor.Permanent = !!this.PermanentFormControl.value;

                app.Processor.PreserveMethod =
                    !!this.PreserveMethodFormControl.value;

                app.Processor.Redirect = this.RedirectFormControl.value;
                break;
        }

        if (!app.LookupConfig.PathRegex.startsWith('/')) {
            app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
        }

        const saveAppReq: SaveApplicationAsCodeEventRequest = {
            ProjectLookup: this.ProjectLookup,
            Application: app,
            ApplicationLookup:
                this.EditingApplicationLookup || Guid.CreateRaw(),
        };

        if (
            this.HasBuildFormControl.value &&
            this.ProcessorType !== 'redirect'
        ) {
            if (app) {
                app.LowCodeUnit.SourceControlLookup =
                    this.SourceControlLookupFormControl.value;
            }
        } else if (app) {
            app.LowCodeUnit.SourceControlLookup = null;
        }

        this.eacSvc.SaveApplicationAsCode(saveAppReq);
    }

    public SetEditingApplication(appLookup: string): void {
        this.EditingApplicationLookup = appLookup;

        this.setupApplicationForm();
    }

    public SourceControlLookupChanged(event: MatSelectChange): void {
        //  TODO:  Anything to do here on change?
    }

    public StartsWith(
        app: EaCApplicationAsCode,
        appRouteBase: string
    ): boolean {
        if (appRouteBase === '/') {
            return app?.LookupConfig?.PathRegex === '/.*';
        } else {
            return app?.LookupConfig?.PathRegex.startsWith(appRouteBase);
        }
    }

    public Unpack(appLookup: string, app: EaCApplicationAsCode): void {
        this.eacSvc.UnpackLowCodeUnit({
            ApplicationLookup: appLookup,
            ApplicationName: app.Application?.Name,
            Version: app.LowCodeUnit?.Version || app.LowCodeUnit?.Build,
        });
    }

    //  Helpers
    protected cleanupLcuTypeSubForm(): void {
        this.ApplicationFormGroup.removeControl('methods');
        this.ApplicationFormGroup.removeControl('apiRoot');
        this.ApplicationFormGroup.removeControl('security');

        this.ApplicationFormGroup.removeControl('spaRoot');

        this.ApplicationFormGroup.removeControl('applicationId');

        this.ApplicationFormGroup.removeControl('build');

        this.ApplicationFormGroup.removeControl('clientId');
        this.ApplicationFormGroup.removeControl('clientSecret');

        this.ApplicationFormGroup.removeControl('zipFile');
    }

    protected cleanupProcessorTypeSubForm(): void {
        this.ApplicationFormGroup.removeControl('defaultFile');
        this.ApplicationFormGroup.removeControl('dfsLcuType');

        this.ApplicationFormGroup.removeControl('oauthLcuType');
        this.ApplicationFormGroup.removeControl('scopes');
        this.ApplicationFormGroup.removeControl('tokenLookup');

        this.ApplicationFormGroup.removeControl('inboundPath');
        this.ApplicationFormGroup.removeControl('proxyLcuType');

        this.ApplicationFormGroup.removeControl('redirect');
        this.ApplicationFormGroup.removeControl('permanent');
        this.ApplicationFormGroup.removeControl('preserveMethod');

        this.cleanupLcuTypeSubForm();
    }

    protected setupApplicationForm(): void {
        this.ProcessorType = this.EditingApplication?.Processor?.Type || '';
        // console.log('ProcessorType = ', this.ProcessorType);

        if (this.EditingApplication != null) {
            this.ApplicationFormGroup = this.formBldr.group({
                name: [
                    this.EditingApplication.Application?.Name,
                    Validators.required,
                ],
                description: [
                    this.EditingApplication.Application?.Description,
                    Validators.required,
                ],
                route: [
                    this.EditingApplication.LookupConfig?.PathRegex.replace(
                        '.*',
                        ''
                    ) || '/',
                    Validators.required,
                ],
                // priority: [
                //   this.EditingApplication.Application?.Priority || 10000,
                //   Validators.required,
                // ],
                procType: [this.ProcessorType, [Validators.required]],
            });

            this.setupBuildForm();

            this.setupSecurityForm();

            this.setupProcessorTypeSubForm();
        }
    }

    protected setupBuildForm(): void {
        this.ApplicationFormGroup.addControl(
            'hasBuild',
            this.formBldr.control(
                !!this.EditingApplication.LowCodeUnit?.SourceControlLookup ||
                    false,
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'sourceControlLookup',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.SourceControlLookup || '',
                []
            )
        );
    }

    protected setupDfsForm(): void {
        this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

        this.ApplicationFormGroup.addControl(
            'defaultFile',
            this.formBldr.control(
                this.EditingApplication.Processor?.DefaultFile || 'index.html',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'lcuType',
            this.formBldr.control(this.LCUType, [Validators.required])
        );
    }

    protected setupLCUAPIForm(): void {
        this.ApplicationFormGroup.addControl(
            'methods',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.AllowedMethods?.join(
                    ' '
                ) || '',
                []
            )
        );

        this.ApplicationFormGroup.addControl(
            'apiRoot',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.APIRoot || '',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'security',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.Security || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUApplicationPointerForm(): void {
        this.ApplicationFormGroup.addControl(
            'applicationId',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ApplicationID || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUGitHubForm(): void {
        this.ApplicationFormGroup.addControl(
            'build',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.Build || 'latest',
                [Validators.required]
            )
        );
    }

    protected setupLCUGitHubOAuthForm(): void {
        this.ApplicationFormGroup.addControl(
            'clientId',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ClientID || '',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'clientSecret',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ClientSecret || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUNPMForm(): void {
        // this.ApplicationFormGroup.addControl(
        //   'package',
        //   this.formBldr.control(
        //     this.EditingApplication.LowCodeUnit?.Package || '',
        //     [Validators.required]
        //   )
        // );
        // this.ApplicationFormGroup.addControl(
        //   'version',
        //   this.formBldr.control(
        //     this.EditingApplication.LowCodeUnit?.Version || '',
        //     [Validators.required]
        //   )
        // );
    }

    protected setupLCUSPAForm(): void {
        this.ApplicationFormGroup.addControl(
            'spaRoot',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.SPARoot || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUZipForm(): void {
        this.ApplicationFormGroup.addControl(
            'zipFile',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ZipFile || '',
                [Validators.required]
            )
        );
    }

    protected setupLcuTypeSubForm(): void {
        this.cleanupLcuTypeSubForm();

        // this.ApplicationFormGroup.removeControl('package');
        // this.ApplicationFormGroup.removeControl('version');

        if (this.LCUType) {
            switch (this.LCUType) {
                case 'API':
                    this.setupLCUAPIForm();
                    break;

                case 'ApplicationPointer':
                    this.setupLCUApplicationPointerForm();
                    break;

                case 'GitHub':
                    this.setupLCUGitHubForm();
                    break;

                case 'GitHubOAuth':
                    this.setupLCUGitHubOAuthForm();
                    break;

                case 'NPM':
                    this.setupLCUNPMForm();
                    break;

                case 'SPA':
                    this.setupLCUSPAForm();
                    break;

                case 'Zip':
                    this.setupLCUZipForm();
                    break;
            }
        }
    }

    protected setupOAuthForm(): void {
        this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

        this.ApplicationFormGroup.addControl(
            'scopes',
            this.formBldr.control(
                this.EditingApplication.Processor?.Scopes?.Join(' ') || '',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'tokenLookup',
            this.formBldr.control(
                this.EditingApplication.Processor?.TokenLookup || '',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'lcuType',
            this.formBldr.control(this.LCUType, [Validators.required])
        );
    }

    protected setupProxyForm(): void {
        this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

        this.ApplicationFormGroup.addControl(
            'inboundPath',
            this.formBldr.control(
                this.EditingApplication.Processor?.InboundPath || '',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'lcuType',
            this.formBldr.control(this.LCUType, [Validators.required])
        );
    }

    protected setupProcessorTypeSubForm(): void {
        this.cleanupProcessorTypeSubForm();

        if (this.ProcessorType) {
            switch (this.ProcessorType) {
                case 'DFS':
                    this.setupDfsForm();
                    break;

                case 'OAuth':
                    this.setupOAuthForm();
                    break;

                case 'Proxy':
                    this.setupProxyForm();
                    break;

                case 'Redirect':
                    this.setupRedirectForm();
                    break;
            }
        }

        this.setupLcuTypeSubForm();
    }

    protected setupRedirectForm(): void {
        this.ApplicationFormGroup.addControl(
            'redirect',
            this.formBldr.control(
                this.EditingApplication.Processor?.Redirect || '',
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'permanent',
            this.formBldr.control(
                this.EditingApplication.Processor?.Permanent || false,
                []
            )
        );

        this.ApplicationFormGroup.addControl(
            'preserveMethod',
            this.formBldr.control(
                this.EditingApplication.Processor?.PreserveMethod || false,
                []
            )
        );
        this.DetermineTooltipText();
    }

    protected setupSecurityForm(): void {
        this.ApplicationFormGroup.addControl(
            'isPrivate',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.IsPrivate || false,
                [Validators.required]
            )
        );

        this.ApplicationFormGroup.addControl(
            'isTriggerSignIn',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.IsTriggerSignIn || false,
                [Validators.required]
            )
        );
    }
}
