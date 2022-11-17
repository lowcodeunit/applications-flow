import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Guid, Status } from '@lcu/common';
import {
    EaCApplicationAsCode,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { Subscription } from 'rxjs';
import { EditApplicationFormComponent } from '../../controls/edit-application-form/edit-application-form.component';
import { ProcessorDetailsFormComponent } from '../../controls/processor-details-form/processor-details-form.component';
import {
    EaCService,
    SaveApplicationAsCodeEventRequest,
} from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface NewApplicationDialogData {
    environmentLookup: string;
    projectLookup: string;
    currentRoute: string;
}

@Component({
    selector: 'lcu-new-application-dialog',
    templateUrl: './new-application-dialog.component.html',
    styleUrls: ['./new-application-dialog.component.scss'],
})
export class NewApplicationDialogComponent implements OnInit, OnDestroy {
    @ViewChild(EditApplicationFormComponent)
    public ApplicationFormControls: EditApplicationFormComponent;

    @ViewChild(ProcessorDetailsFormComponent)
    public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

    public ErrorMessage: string;

    public Environment: EaCEnvironmentAsCode;

    public HasSaveButton: boolean;

    public NewApplication: EaCApplicationAsCode;

    public NewApplicationLookup: string;

    public SourceControls: { [lookup: string]: EaCSourceControl };

    public SourceControlLookups: Array<string>;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    constructor(
        protected eacSvc: EaCService,
        public dialogRef: MatDialogRef<NewApplicationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NewApplicationDialogData,
        protected snackBar: MatSnackBar
    ) {
        this.HasSaveButton = false;
    }

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe((state) => {
            this.State = state;
            if (this.State?.EaC?.Environments) {
                this.Environment =
                    this.State?.EaC?.Environments[this.data.environmentLookup];
            }
            if (this.Environment?.Sources) {
                this.SourceControls = this.Environment?.Sources;
                this.SourceControlLookups = Object.keys(
                    this.Environment.Sources || {}
                );
            }
        });
        if (!this.NewApplicationLookup) {
            this.SetupApplication(Guid.CreateRaw());
        }
    }

    public ngOnDestroy(): void {
        this.StateSub.unsubscribe();
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public SetupApplication(appLookup: string) {
        this.NewApplication = new EaCApplicationAsCode();
        this.NewApplicationLookup = appLookup;
    }

    public SaveApplication(): void {
        const app: EaCApplicationAsCode = {
            Application: {
                Name: this.ApplicationFormControls.NameFormControl.value,
                Description:
                    this.ApplicationFormControls.DescriptionFormControl.value,
                PriorityShift: 0,
            },
            AccessRightLookups: [],
            DataTokens: {},
            LicenseConfigurationLookups: [],
            LookupConfig: {
                IsPrivate: false,
                IsTriggerSignIn: false,
                PathRegex: `${this.ApplicationFormControls.RouteFormControl.value}.*`,
                QueryRegex: '',
                HeaderRegex: '',
                AllowedMethods:
                    this.ProcessorDetailsFormControls.MethodsFormControl?.value
                        ?.split(' ')
                        .filter((v: string) => !!v),
            },
            Processor: {
                Type: this.ProcessorDetailsFormControls.ProcessorType,
            },
            LowCodeUnit: {},
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
            ProjectLookup: this.data.projectLookup,
            Application: app,
            ApplicationLookup: this.NewApplicationLookup,
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

        this.eacSvc.SaveApplicationAsCode(saveAppReq).then((res) => {
            this.handleSaveStatus(res);
        });
    }

    protected handleSaveStatus(status: Status) {
        // console.log('event to save: ', status);
        if (status.Code === 0) {
            this.snackBar.open('Application Succesfully Created', 'Dismiss', {
                duration: 5000,
            });
            setTimeout(() => {
                this.snackBar.open(
                    'Configuring Application: This may take a couple minutes.',
                    'Dismiss',
                    {
                        duration: 10000,
                    }
                );
            }, 6000);
            this.CloseDialog();
        } else {
            this.ErrorMessage = status.Message;
        }
    }
}
