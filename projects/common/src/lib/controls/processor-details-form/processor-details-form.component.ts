import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BaseModeledResponse, Guid } from '@lcu/common';
import {
    EaCApplicationAsCode,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import {
    EaCService,
    SaveApplicationAsCodeEventRequest,
} from '../../services/eac.service';

@Component({
    selector: 'lcu-processor-details-form',
    templateUrl: './processor-details-form.component.html',
    styleUrls: ['./processor-details-form.component.scss'],
})
export class ProcessorDetailsFormComponent implements OnInit {
    @Input('editing-application')
    public EditingApplication: EaCApplicationAsCode;

    @Input('editing-application-lookup')
    public EditingApplicationLookup: string;

    @Input('environment')
    public Environment: EaCEnvironmentAsCode;

    @Input('has-save-button')
    public HasSaveButton: boolean;

    @Input('is-disabled')
    public IsDisabled: boolean;

    @Input('source-control-lookups')
    public SourceControlLookups: Array<string>;

    @Input('project-lookup')
    public ProjectLookup: string;

    @Input('loading')
    public Loading: boolean;

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<{}>;

    public get APIRootFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.apiRoot;
    }

    public get BuildFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.build;
    }

    public get BuildPathFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.buildPath;
    }

    public get ClientIDFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.clientId;
    }

    public get ClientSecretFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.clientSecret;
    }

    public get DefaultFileFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.defaultFile;
    }

    public get DefaultSourceControl(): EaCSourceControl {
        return {
            Organization: this.EditingApplication?.LowCodeUnit?.Organization,
            Repository: this.EditingApplication?.LowCodeUnit?.Repository,
        };
    }

    public get InboundPathFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.inboundPath;
    }

    public get IncludeRequestFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.includeRequest;
    }

    public get MethodsFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.methods;
    }

    public get PackageFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.package;
    }

    public get PermanentFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.permanent;
    }

    public get PreserveMethodFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.preserveMethod;
    }

    public get RedirectFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.redirect;
    }

    public get ScopesFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.scopes;
    }

    public get SecurityFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.security;
    }

    public get SourceControlFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.sourceControl;
    }

    public get SPARootFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.spaRoot;
    }

    public get TokenLookupFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.tokenLookup;
    }

    public get ValidFormControls(): Array<AbstractControl> {
        let vfc: Array<AbstractControl> = new Array<AbstractControl>();
        for (const field in this.ProcessorDetailsFormGroup?.controls) {
            const control = this.ProcessorDetailsFormGroup?.get(field);
            if (control.valid) {
                vfc.push(control);
            }
        }
        // console.log("VFC=", vfc)
        return vfc;
    }

    public get VersionFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.version;
    }

    public get ZipFileFormControl(): AbstractControl {
        return this.ProcessorDetailsFormGroup?.controls.zipFile;
    }

    public BuildPathOptions: string[];

    public IsPermanent: boolean;

    public IsPreserve: boolean;

    public IsSourceControlValid: boolean;

    public LCUType: string;

    public redirectTooltip: string;

    public SourceControls: { [lookup: string]: EaCSourceControl };

    public ProcessorDetailsFormGroup: FormGroup;

    public ProcessorType: string;

    constructor(
        protected appsFlowSvc: ApplicationsFlowService,
        protected formBldr: FormBuilder,
        protected eacSvc: EaCService
    ) {
        this.redirectTooltip = '';

        this.HasSaveButton = true;

        this.SaveFormEvent = new EventEmitter();
    }

    public ngOnInit(): void {}

    public ngOnChanges() {
        if (this.Environment?.Sources) {
            this.SourceControls = this.Environment?.Sources;
        }
        if (!this.EditingApplication) {
            this.CreateNewApplication();
        } else if (!this.ProcessorDetailsFormGroup) {
            this.SetupProcessorDetailsForm();
        }
        // else if (this.EditingApplication && !this.ProcessorDetailsFormGroup) {
        //     this.SetupProcessorDetailsForm();
        // }

        // if (this.IsDisabled) {
        //     this.setupProcessorDetailsForm();
        //     this.ProcessorDetailsFormGroup.disable();
        // } else {
        //     this.ProcessorDetailsFormGroup.enable();
        // }
    }

    public CreateNewApplication(): void {
        this.SetEditingApplication(Guid.CreateRaw());
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

    public SaveProcessorDetails(): void {
        // console.log('Save processor details getting called');
        const app: EaCApplicationAsCode = this.EditingApplication;
        app.LookupConfig.AllowedMethods = this.MethodsFormControl?.value
            ?.split(' ')
            .filter((v: string) => !!v);
        app.Processor.Type = this.ProcessorType;

        switch (app.Processor.Type) {
            case 'DFS':
                app.Processor.DefaultFile =
                    this.DefaultFileFormControl.value || 'index.html';

                app.LowCodeUnit = {
                    Type: this.LCUType,
                };

                switch (app.LowCodeUnit.Type) {
                    case 'GitHub':
                        app.LowCodeUnit.Organization =
                            this.SourceControls[
                                this.SourceControlFormControl.value
                            ]?.Organization;

                        app.LowCodeUnit.Repository =
                            this.SourceControls[
                                this.SourceControlFormControl.value
                            ]?.Repository;

                        app.LowCodeUnit.Build = this.BuildFormControl.value;

                        app.LowCodeUnit.Path = this.BuildPathFormControl.value;

                        app.LowCodeUnit.SourceControlLookup =
                            this.SourceControlFormControl.value;
                        break;

                    case 'NPM':
                        app.LowCodeUnit.Package = this.PackageFormControl.value;

                        app.LowCodeUnit.Version = this.VersionFormControl.value;
                        break;

                    case 'WordPress':
                        app.LowCodeUnit.APIRoot = this.APIRootFormControl.value;
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
                app.Processor.IncludeRequest =
                    !!this.IncludeRequestFormControl.value;

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

        this.eacSvc.SaveApplicationAsCode(saveAppReq).then((res) => {
            this.SaveFormEvent.emit(res);
        });
    }

    public SetEditingApplication(appLookup: string): void {
        this.EditingApplication = new EaCApplicationAsCode();
        this.EditingApplicationLookup = appLookup;

        this.SetupProcessorDetailsForm();
    }

    public SourceControlChanged(event: any) {
        this.IsSourceControlValid = this.SourceControlFormControl.valid;
        this.listBuildPaths();
    }

    public ProcessorTypeChanged(event: MatSelectChange): void {
        this.ProcessorType = event.value;
        this.LCUType = null;

        this.setupProcessorTypeSubForm();
        // console.log("proc type changed: ", this.ProcessorDetailsFormGroup.controls)
    }

    public LCUTypeChanged(event: MatSelectChange): void {
        this.LCUType = event.value;
        // console.log("lcu type changed: ", event.value)

        this.setupLcuTypeSubForm();
        // console.log("lcu type changed: ", this.ProcessorDetailsFormGroup.controls)
    }

    //HELPERS

    protected cleanupLcuTypeSubForm(): void {
        this.ProcessorDetailsFormGroup.removeControl('methods');
        this.ProcessorDetailsFormGroup.removeControl('apiRoot');
        this.ProcessorDetailsFormGroup.removeControl('security');

        this.ProcessorDetailsFormGroup.removeControl('spaRoot');

        this.ProcessorDetailsFormGroup.removeControl('applicationId');
        this.ProcessorDetailsFormGroup.removeControl('sourceControl');

        this.ProcessorDetailsFormGroup.removeControl('build');

        this.ProcessorDetailsFormGroup.removeControl('clientId');
        this.ProcessorDetailsFormGroup.removeControl('clientSecret');
        this.ProcessorDetailsFormGroup.removeControl('package');
        this.ProcessorDetailsFormGroup.removeControl('version');

        this.ProcessorDetailsFormGroup.removeControl('zipFile');

        // console.log("proc group: ", this.ProcessorDetailsFormGroup.controls);
    }

    protected cleanupProcessorTypeSubForm(): void {
        this.ProcessorDetailsFormGroup.removeControl('defaultFile');

        // this.ApplicationFormGroup.removeControl('dfsLcuType');

        // this.ApplicationFormGroup.removeControl('oauthLcuType');
        this.ProcessorDetailsFormGroup.removeControl('scopes');
        this.ProcessorDetailsFormGroup.removeControl('tokenLookup');

        this.ProcessorDetailsFormGroup.removeControl('inboundPath');
        this.ProcessorDetailsFormGroup.removeControl('proxyLcuType');

        this.ProcessorDetailsFormGroup.removeControl('includeRequest');
        this.ProcessorDetailsFormGroup.removeControl('redirect');
        this.ProcessorDetailsFormGroup.removeControl('permanent');
        this.ProcessorDetailsFormGroup.removeControl('preserveMethod');

        this.cleanupLcuTypeSubForm();
    }

    protected listBuildPaths(): void {
        // this.Loading = true;

        // console.log(
        //     'Source Control: ',
        //     this.SourceControls[this.SourceControlFormControl.value]
        // );

        this.appsFlowSvc
            .ListBuildPaths(
                this.SourceControls[this.SourceControlFormControl.value]
                    ?.Organization,
                this.SourceControls[this.SourceControlFormControl.value]
                    ?.Repository
            )
            .subscribe((response: BaseModeledResponse<string[]>) => {
                this.BuildPathOptions = response.Model;
                // console.log('build path options: ', this.BuildPathOptions);

                // this.Loading = false;

                // if (this.BuildPathOptions?.length === 1) {
                //   this.BuildPathFormControl.setValue(this.BuildPathOptions[0]);
                // }
            });
    }

    protected setupLcuTypeSubForm(): void {
        this.cleanupLcuTypeSubForm();
        // console.log('LCU Type: ', this.LCUType);

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

                case 'WordPress':
                    this.setupLCUWordPressForm();
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

    public SetupProcessorDetailsForm(): void {
        this.ProcessorType = this.EditingApplication?.Processor?.Type || '';

        // console.log('EDITING APP = ', this.EditingApplication);
        this.ProcessorDetailsFormGroup;
        if (this.EditingApplication != null) {
            this.ProcessorDetailsFormGroup = this.formBldr.group({
                procType: [this.ProcessorType, [Validators.required]],
            });
            // this.setupDfsForm();

            // this.setupLcuTypeSubForm();
            this.setupProcessorTypeSubForm();
        }
    }

    protected setupLCUGitHubForm(): void {
        // console.log('EditingApplication: ', this.EditingApplication);

        this.ProcessorDetailsFormGroup.addControl(
            'sourceControl',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.SourceControlLookup || '',
                [Validators.required]
            )
        );

        this.IsSourceControlValid = this.SourceControlFormControl.valid;

        this.ProcessorDetailsFormGroup.addControl(
            'buildPath',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.Path || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'build',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.Build || 'latest',
                [Validators.required]
            )
        );

        this.listBuildPaths();
    }

    protected setupLCUApplicationPointerForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'applicationId',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ApplicationID || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUSPAForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'spaRoot',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.SPARoot || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUAPIForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'methods',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.AllowedMethods?.join(
                    ' '
                ) || '',
                []
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'apiRoot',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.APIRoot || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'security',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.Security || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUNPMForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'sourceControl',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.SourceControlLookup || ''
            )
        );
    }

    protected setupLCUGitHubOAuthForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'clientId',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ClientID || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'clientSecret',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ClientSecret || '',
                [Validators.required]
            )
        );
    }

    protected setupLCUWordPressForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'apiRoot',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.APIRoot || '',
                [Validators.required]
            )
        );
    }

    protected setupProxyForm(): void {
        this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

        this.ProcessorDetailsFormGroup.addControl(
            'inboundPath',
            this.formBldr.control(
                this.EditingApplication.Processor?.InboundPath || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'lcuType',
            this.formBldr.control(this.LCUType, [Validators.required])
        );
    }

    protected setupRedirectForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'redirect',
            this.formBldr.control(
                this.EditingApplication.Processor?.Redirect || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'permanent',
            this.formBldr.control(
                this.EditingApplication.Processor?.Permanent || false,
                []
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'preserveMethod',
            this.formBldr.control(
                this.EditingApplication.Processor?.PreserveMethod || false,
                []
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'includeRequest',
            this.formBldr.control(
                this.EditingApplication.Processor?.IncludeRequest || false,
                []
            )
        );

        this.DetermineTooltipText();
    }

    protected setupOAuthForm(): void {
        this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

        this.ProcessorDetailsFormGroup.addControl(
            'scopes',
            this.formBldr.control(
                this.EditingApplication.Processor?.Scopes?.Join(' ') || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'tokenLookup',
            this.formBldr.control(
                this.EditingApplication.Processor?.TokenLookup || '',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
            'lcuType',
            this.formBldr.control(this.LCUType, [Validators.required])
        );
    }

    protected setupLCUZipForm(): void {
        this.ProcessorDetailsFormGroup.addControl(
            'zipFile',
            this.formBldr.control(
                this.EditingApplication.LowCodeUnit?.ZipFile || '',
                [Validators.required]
            )
        );
    }

    protected setupDfsForm(): void {
        this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

        this.ProcessorDetailsFormGroup.addControl(
            'defaultFile',
            this.formBldr.control(
                this.EditingApplication.Processor?.DefaultFile || 'index.html',
                [Validators.required]
            )
        );

        this.ProcessorDetailsFormGroup.addControl(
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
}
