import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Guid, Status } from '@lcu/common';
import {
    EaCApplicationAsCode,
    EaCEnvironmentAsCode,
    EaCSourceControl,
    EnterpriseAsCode,
} from '@semanticjs/common';
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
export class NewApplicationDialogComponent implements OnInit {
    @ViewChild(EditApplicationFormComponent)
    public ApplicationFormControls: EditApplicationFormComponent;

    @ViewChild(ProcessorDetailsFormComponent)
    public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

    public get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[this.data.environmentLookup];
    }

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public get SourceControlLookups(): Array<string> {
        return Object.keys(this.Environment.Sources || {});
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public ErrorMessage: string;

    public HasSaveButton: boolean;

    public NewApplication: EaCApplicationAsCode;

    public NewApplicationLookup: string;

    constructor(
        protected eacSvc: EaCService,
        public dialogRef: MatDialogRef<NewApplicationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NewApplicationDialogData,
        protected snackBar: MatSnackBar
    ) {
        this.HasSaveButton = false;
    }

    public ngOnInit(): void {
        this.SetupApplication(Guid.CreateRaw());
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
        console.log('event to save: ', status);
        if (status.Code === 0) {
            this.snackBar.open('Application Succesfully Created', 'Dismiss', {
                duration: 5000,
            });
            this.CloseDialog();
        } else {
            this.ErrorMessage = status.Message;
        }
    }
}
