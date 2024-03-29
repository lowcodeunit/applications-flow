import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { BaseModeledResponse, Guid } from '@lcu/common';
import {
    EaCArtifact,
    EaCDevOpsAction,
    EaCEnvironmentAsCode,
} from '@semanticjs/common';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import {
    EaCService,
    SaveEnvironmentAsCodeEventRequest,
} from '../../services/eac.service';
import {
    ProjectHostingDetails,
    ProjectHostingOption,
} from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-build-pipeline-form',
    templateUrl: './build-pipeline-form.component.html',
    styleUrls: ['./build-pipeline-form.component.scss'],
})
export class BuildPipelineFormComponent implements OnInit {
    //PROPERTIES

    // @Input('build-pipeline')
    public BuildPipeline: string;

    @Input('devops-action-lookup')
    public DevOpsActionLookup: string;

    @Input('disabled')
    public Disabled: boolean;

    @Input('environment')
    public Environment: EaCEnvironmentAsCode;

    @Input('environment-lookup')
    public EnvironmentLookup: string;

    // @Input('hosting-details')
    public HostingDetails: ProjectHostingDetails;

    @Input('loading')
    public Loading: boolean;

    @Output('response-event')
    public ResponseEvent: EventEmitter<any>;

    protected get Artifact(): EaCArtifact {
        // console.log("ARTIFACT: ", this.Environment?.Artifacts[this.ArtifactLookup]);
        return this.Environment?.Artifacts && this.ArtifactLookup
            ? this.Environment?.Artifacts[this.ArtifactLookup] || {}
            : {};
    }

    protected get ArtifactLookup(): string {
        const artLookup = this.DevOpsAction?.ArtifactLookups
            ? this.DevOpsAction?.ArtifactLookups[0]
            : null;

        return artLookup;
    }

    public get BuildPipelineFormControl(): AbstractControl {
        return this.BuildPipelineFormGroup?.get('buildPipeline');
    }

    protected get DevOpsAction(): EaCDevOpsAction {
        return this.Environment.DevOpsActions && this.DevOpsActionLookup
            ? this.Environment.DevOpsActions[this.DevOpsActionLookup] || {}
            : {};
    }

    protected get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
        return this.Environment.DevOpsActions || {};
    }

    public get DevOpsActionNameFormControl(): AbstractControl {
        return this.BuildPipelineFormGroup.get('devOpsActionName');
    }

    public get NPMTokenFormControl(): AbstractControl {
        return this.BuildPipelineFormGroup.get('npmToken');
    }

    protected get SelectedHostingOptionInputControlValues(): {
        [lookup: string]: any;
    } {
        return this.SelectedHostingOption?.Inputs?.reduce((prev, cur) => {
            const res: any = {
                ...prev,
            };

            res[cur.Lookup] =
                this.BuildPipelineFormGroup.controls[cur.Lookup].value;

            return res;
        }, {});
    }

    // public DevOpsAction: EaCDevOpsAction;

    // public DevOpsActions: { [lookup: string]: EaCDevOpsAction };

    public BuildPipelineFormGroup: FormGroup;

    // public SelectedHostingOptionInputControlValues: {
    //     [lookup: string]: any;
    // };

    public SelectedHostingOption: ProjectHostingOption;

    constructor(
        protected eacSvc: EaCService,
        protected formBuilder: FormBuilder,
        protected appsFlowSvc: ApplicationsFlowService
    ) {
        this.Disabled = false;
        this.HostingDetails = new ProjectHostingDetails();
        this.ResponseEvent = new EventEmitter();
    }

    public ngOnInit(): void {
        this.BuildPipelineFormGroup = this.formBuilder.group({});

        this.loadProjectHostingDetails();
    }

    public ngOnChanges() {
        this.loadProjectHostingDetails();
    }

    //API METHODS

    public BuildPipelineChanged(): void {
        //for some reason this value is coming back undefined
        // console.log("build pipeline value: ", this.BuildPipelineFormControl?.value)
        this.BuildPipeline = this.BuildPipelineFormControl?.value;
        // this.loadProjectHostingDetails();

        this.setupControlsForForm();
    }

    public SubmitBuildPipeline() {
        // console.log("submitting build pipeline: ", this.BuildPipelineFormGroup.value);
        this.SaveEnvironment();
    }

    public SaveEnvironment(): void {
        // console.log("submitting build pipeline: ", this.BuildPipelineFormGroup.value);

        const saveEnvReq: SaveEnvironmentAsCodeEventRequest = {
            Environment: {
                //...this.Environment,
                Artifacts: this.Environment.Artifacts || {},
                DevOpsActions: this.Environment.DevOpsActions || {},
                //Secrets: this.Environment.Secrets || {},
                //Sources: this.Environment.Sources || {},
            },
            EnvironmentLookup: this.EnvironmentLookup,
            //EnterpriseDataTokens: {},
        };

        let artifactLookup: string;

        let artifact: EaCArtifact = {
            ...this.Artifact,
            ...this.SelectedHostingOptionInputControlValues,
        };

        if (!this.ArtifactLookup) {
            artifactLookup = Guid.CreateRaw();

            artifact = {
                ...artifact,
                Type: this.SelectedHostingOption.ArtifactType,
                Name: this.SelectedHostingOption.Name,
                NPMRegistry: 'https://registry.npmjs.org/',
            };
        } else {
            artifactLookup = this.ArtifactLookup;
        }

        saveEnvReq.Environment.Artifacts[artifactLookup] = artifact;

        let devOpsActionLookup: string;

        if (!this.DevOpsActionLookup) {
            devOpsActionLookup = Guid.CreateRaw();

            const doa: EaCDevOpsAction = {
                ...this.DevOpsAction,
                ArtifactLookups: [artifactLookup],
                Name: this.DevOpsActionNameFormControl.value,
                Path: this.SelectedHostingOption.Path,
                Templates: this.SelectedHostingOption.Templates,
            };

            if (this.NPMTokenFormControl?.value) {
                const secretLookup = 'npm-access-token';

                doa.SecretLookups = [secretLookup];

                if (!saveEnvReq.Environment.Secrets[secretLookup]) {
                    saveEnvReq.Environment.Secrets[secretLookup] = {
                        Name: 'NPM Access Token',
                        DataTokenLookup: secretLookup,
                        KnownAs: 'NPM_TOKEN',
                    };
                }

                saveEnvReq.EnterpriseDataTokens[secretLookup] = {
                    Value: this.NPMTokenFormControl.value,
                };
            }

            saveEnvReq.Environment.DevOpsActions[devOpsActionLookup] = doa;
        } else {
            devOpsActionLookup = this.DevOpsActionLookup;

            const doa: EaCDevOpsAction = {
                ...this.DevOpsAction,
                Name: this.DevOpsActionNameFormControl.value,
            };

            saveEnvReq.Environment.DevOpsActions[devOpsActionLookup] = doa;
        }
        // console.log('env req: ', saveEnvReq);

        this.eacSvc.SaveEnvironmentAsCode(saveEnvReq).then((res) => {
            this.ResponseEvent.emit(res);
        });
    }

    //  Helpers

    protected getSelectedHostingOption() {
        this.SelectedHostingOption = this.HostingDetails?.HostingOptions?.find(
            (ho) => ho.Lookup === this.BuildPipeline
        );
    }
    protected setupControlsForForm(): void {
        this.getSelectedHostingOption();

        // this.BuildPipeline =
        //         this.BuildPipeline || this.HostingDetails?.HostingOptions
        //           ? this.HostingDetails?.HostingOptions[0]?.Lookup
        //           : '';

        // console.log("hosting details: ", this.HostingDetails)

        for (const ctrlName in this.BuildPipelineFormGroup.controls) {
            //devOpsAction doesn't exist
            //removes hosting details
            if (ctrlName !== 'buildPipeline' && ctrlName !== 'devOpsAction') {
                // console.log("removing control: ", ctrlName)
                this.BuildPipelineFormGroup.removeControl(ctrlName);
            }
        }

        this.BuildPipelineFormGroup.addControl(
            'buildPipeline',
            this.formBuilder.control(this.BuildPipeline || '', [
                Validators.required,
            ])
        );

        this.BuildPipelineFormGroup.addControl(
            'devOpsActionName',
            this.formBuilder.control(
                this.DevOpsAction?.Name ||
                    this.SelectedHostingOption?.Name ||
                    '',
                [Validators.required]
            )
        );

        // console.log("selected hosting options: ", this.SelectedHostingOption?.Inputs);

        this.SelectedHostingOption?.Inputs?.forEach((input) => {
            const validators = input.Required ? [Validators.required] : [];

            this.BuildPipelineFormGroup.addControl(
                input.Lookup,
                this.formBuilder.control(
                    this.Artifact[input.Lookup] || input.DefaultValue || '',
                    validators
                )
            );

            // if (this.Disabled) {
            //   this.FormGroup.controls[input.Lookup].disable();
            // }
        });

        if (this.BuildPipelineFormControl?.value === 'npm-release') {
            // console.log('npm release');
            if (!this.BuildPipelineFormGroup?.controls?.npmToken) {
                // console.log('npm token if');
                this.BuildPipelineFormGroup.addControl(
                    'npmToken',
                    this.formBuilder.control(
                        '',
                        this.Disabled ? [] : [Validators.required]
                    )
                );

                if (this.Disabled) {
                    this.BuildPipelineFormGroup.controls.npmToken.disable();
                }
            }
        } else if (
            this.BuildPipelineFormControl?.value === 'github-artifacts-release'
        ) {
            if (this.BuildPipelineFormGroup?.controls?.npmToken) {
                this.BuildPipelineFormGroup.removeControl('npmToken');
            }
        }
    }

    protected loadProjectHostingDetails(): void {
        this.HostingDetails.Loading = true;
        this.appsFlowSvc.LoadProjectHostingDetails().subscribe(
            (response: BaseModeledResponse<ProjectHostingDetails>) => {
                this.HostingDetails = response.Model;
                // console.log('response: ', response);
                this.HostingDetails.Loading = false;

                // console.log(' DevOpsAction.Path: ', this.DevOpsAction.Path);

                const hostOption = this.HostingDetails?.HostingOptions?.find(
                    (ho) => ho.Path === this.DevOpsAction.Path
                );

                this.BuildPipeline = hostOption?.Lookup;
                // this.SelectedHostingOption = hostOption;

                // console.log("Build Pipeline HERE= ", this.BuildPipeline);

                this.setupControlsForForm();
            },
            (err) => {
                console.log('ERR: ', err);
                this.HostingDetails.Loading = false;
            }
        );
        // console.log('HOSTING DETAILS: ', this.HostingDetails);
    }
}
