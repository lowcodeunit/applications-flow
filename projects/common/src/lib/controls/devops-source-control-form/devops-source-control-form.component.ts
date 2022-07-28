import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { BaseModeledResponse, BaseResponse, Guid, Status } from '@lcu/common';
import {
    EaCArtifact,
    EaCDevOpsAction,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import {
    EaCService,
    SaveEnvironmentAsCodeEventRequest,
} from '../../services/eac.service';
import {
    GitHubBranch,
    GitHubOrganization,
    GitHubRepository,
    ProjectHostingDetails,
} from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-devops-source-control-form',
    templateUrl: './devops-source-control-form.component.html',
    styleUrls: ['./devops-source-control-form.component.scss'],
})
export class DevopsSourceControlFormComponent
    implements AfterViewInit, OnDestroy, OnInit
{
    //  Fields

    @Input('editing-source-control-lookup')
    public EditingSourceControlLookup: string;

    @Input('environment')
    public Environment: EaCEnvironmentAsCode;

    @Input('environment-lookup')
    public EnvironmentLookup: string;

    @Input('loading')
    public Loading: boolean;

    @Output('save-status-event')
    public SaveStatusEvent: EventEmitter<Status>;

    @ViewChild('branches')
    public BranchesInput: ElementRef<HTMLInputElement>;

    //Optional input not being used setting to
    // @Input('build-path')
    public BuildPath: string;

    //Optional not being used
    // @Input('build-path-disabled')
    public BuildPathDisabled: boolean;

    // this input is not being used anywhere
    // @Input('source-control-root')
    public SourceControlRoot: string;

    //not being used set to true by default
    // @Input('use-branches')
    public UseBranches: boolean;

    //not being used set to false by default
    // @Input('use-build-path')
    public UseBuildPath: boolean;

    //  Properties

    public get BranchesFormControl(): AbstractControl {
        return this.DevOpsSourceControlFormGroup.get(
            this.SourceControlRoot + 'branches'
        );
    }

    public get BuildPathFormControl(): AbstractControl {
        return this.DevOpsSourceControlFormGroup.get(
            this.SourceControlRoot + 'buildPath'
        );
    }

    public get DevOpsActionLookupFormControl(): AbstractControl {
        return this.DevOpsSourceControlFormGroup.get('devOpsActionLookup');
    }

    public get MainBranchFormControl(): AbstractControl {
        return this.DevOpsSourceControlFormGroup.get(
            this.SourceControlRoot + 'mainBranch'
        );
    }

    public get OrganizationFormControl(): AbstractControl {
        return this.DevOpsSourceControlFormGroup.get(
            this.SourceControlRoot + 'organization'
        );
    }

    public get RepositoryFormControl(): AbstractControl {
        return this.DevOpsSourceControlFormGroup.get(
            this.SourceControlRoot + 'repository'
        );
    }

    public Artifact: EaCArtifact;

    public ArtifactLookup: string;

    public ArtifactLookups: Array<string>;

    public BranchOptions: GitHubBranch[];

    public BuildPathOptions: string[];

    public CreatingRepository: boolean;

    public DevOpsAction: any;

    public DevOpsActions: { [lookup: string]: EaCDevOpsAction };

    public DevOpsActionLookup: string;

    public DevOpsActionLookups: Array<string>;

    public DevOpsSourceControlFormGroup: FormGroup;

    public EditingSourceControl: EaCSourceControl;

    public HostingDetails: ProjectHostingDetails;

    public OrganizationOptions: GitHubOrganization[];

    public RepositoryOptions: GitHubRepository[];

    public SelectedBranches: string[];

    public SkeletonEffect: string;

    public readonly SeparatorKeysCodes = [ENTER, COMMA] as const;

    //  Constructors
    constructor(
        protected appsFlowSvc: ApplicationsFlowService,
        protected eacSvc: EaCService,
        protected formBuilder: FormBuilder
    ) {
        this.SaveStatusEvent = new EventEmitter();

        this.EditingSourceControl = {};

        this.BuildPath = null;

        this.HostingDetails = new ProjectHostingDetails();

        this.SelectedBranches = [];

        this.SourceControlRoot = '';

        this.SkeletonEffect = 'wave';

        this.UseBranches = true;

        this.UseBuildPath = false;
    }

    //  Life Cycle
    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.destroyFormControls();
    }

    public ngOnInit(): void {
        console.log('source control lookup', this.EditingSourceControlLookup);

        if (this.EditingSourceControlLookup === null) {
            this.CreateNewSourceControl();
        }
        console.log('source control', this.EditingSourceControl);

        if (this.EditingSourceControl != null) {
            this.DevOpsSourceControlFormGroup = this.formBuilder.group({});

            this.setupFormControls();
        }

        this.RefreshOrganizations();
    }

    public ngOnChanges() {
        if (this.Environment) {
            if (this.Environment?.Artifacts && this.ArtifactLookup) {
                this.Artifact =
                    this.Environment?.Artifacts[this.ArtifactLookup];
            }

            if (this.Environment?.DevOpsActions) {
                this.DevOpsActions = this.Environment.DevOpsActions;

                if (this.DevOpsActionLookup) {
                    this.DevOpsAction =
                        this.Environment.DevOpsActions[this.DevOpsActionLookup];
                }
            }

            if (this.DevOpsAction.ArtifactLookups) {
                this.ArtifactLookups = this.DevOpsAction.ArtifactLookups;

                this.ArtifactLookup = this.DevOpsAction?.ArtifactLookups[0];
            }
        }
        if (this.DevOpsActions) {
            this.DevOpsActionLookups = Object.keys(this.DevOpsActions || {});
        }

        if (this.Environment?.Sources && this.EditingSourceControlLookup) {
            this.EditingSourceControl =
                this.Environment?.Sources[this.EditingSourceControlLookup];
        }

        if (!!this.DevOpsActionLookupFormControl?.value) {
            this.DevOpsActionLookup = this.DevOpsActionLookupFormControl.value;
        }

        if (!!this.EditingSourceControl?.DevOpsActionTriggerLookups) {
            this.DevOpsActionLookup =
                this.EditingSourceControl?.DevOpsActionTriggerLookups[0];
        } else {
            this.DevOpsActionLookup = null;
        }
    }

    //  API Methods
    public AddBranchOption(event: MatChipInputEvent): void {
        this.addBranchOption(event.value);

        event.input.value = '';
    }

    public BranchOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.addBranchOption(event.option.value);
    }

    public BranchesChanged(branches: string[]): void {
        this.loadProjectHostingDetails();
    }

    public BuildPathChanged(event: MatSelectChange): void {
        //do something??
    }

    public CreateNewSourceControl(): void {
        this.SetEditingSourceControl(Guid.CreateRaw());
    }

    public CreateRepository(): void {
        this.CreatingRepository = true;

        this.RepositoryFormControl.reset();
    }

    public CancelCreateRepository(): void {
        this.CreatingRepository = false;
    }

    public DevOpsActionLookupChanged(event: MatSelectChange): void {
        this.configureDevOpsAction();
    }

    public MainBranchChanged(event: MatSelectChange): void {
        this.emitBranchesChanged();
    }

    public OrganizationChanged(event: MatSelectChange): void {
        const org = this.OrganizationFormControl;

        this.RepositoryFormControl.reset();

        if (this.UseBranches) {
            this.BranchesFormControl.reset();

            this.SelectedBranches = [];
        }

        this.listRepositories();
    }

    public RefreshOrganizations(): void {
        // this.Loading = true;
        this.listOrganizations();

        this.OrganizationFormControl?.reset();

        this.RepositoryFormControl?.reset();

        if (this.UseBranches) {
            this.BranchesFormControl?.reset();
        }
    }

    public RemoveBranchOption(option: string): void {
        const index = this.SelectedBranches.indexOf(option);

        if (index >= 0) {
            this.SelectedBranches.splice(index, 1);
        }

        this.emitBranchesChanged();
    }

    public RepositoryChanged(event: MatSelectChange): void {
        const repo = this.RepositoryFormControl;

        if (this.UseBranches) {
            this.BranchesFormControl.reset();

            this.SelectedBranches = [];

            this.listBranches();
        }

        if (!this.UseBranches) {
            this.listBuildPaths();
        }
    }

    public SaveRepository(): void {
        this.Loading = true;

        const org = this.OrganizationFormControl.value;

        const repoName = this.RepositoryFormControl.value;

        this.appsFlowSvc
            .CreateRepository(org, repoName)
            .subscribe((response: BaseResponse) => {
                if (response.Status.Code === 0) {
                    this.listRepositories(repoName);

                    this.CreatingRepository = false;
                } else {
                    //  TODO:  Need to surface an error to the user...

                    this.Loading = false;
                }
            });
    }

    public SetEditingSourceControl(scLookup: string): void {
        this.EditingSourceControlLookup = scLookup;
    }

    public SubmitSourceControl() {
        console.log(
            'source control submitted: ',
            this.DevOpsSourceControlFormGroup.value
        );
        this.SaveSourceControl();
    }

    public SaveSourceControl(): void {
        const saveEnvReq: SaveEnvironmentAsCodeEventRequest = {
            Environment: {
                ...this.Environment,
                Sources: this.Environment.Sources || {},
            },
            EnvironmentLookup: this.EnvironmentLookup,
            EnterpriseDataTokens: {},
        };

        let source: EaCSourceControl = {
            ...this.EditingSourceControl,
            Branches: this.SelectedBranches,
            MainBranch: this.MainBranchFormControl.value,
        };

        source = {
            ...source,
            Type: 'GitHub',
            Name: `@${this.OrganizationFormControl.value}/${this.RepositoryFormControl.value}`,
            DevOpsActionTriggerLookups: [this.DevOpsActionLookup],
            Organization: this.OrganizationFormControl.value,
            Repository: this.RepositoryFormControl.value,
        };

        const scLookup = `github://${source.Organization}/${source.Repository}`;

        saveEnvReq.Environment.Sources[scLookup] = source;

        console.log('save SC: ', saveEnvReq);

        let resp = this.eacSvc.SaveEnvironmentAsCode(saveEnvReq);

        resp.then((res) => {
            this.SaveStatusEvent.emit(res);
        });
    }

    //  Helpers

    protected addBranchOption(value: string): void {
        value = (value || '').trim();

        if (value && this.SelectedBranches.indexOf(value) < 0) {
            this.SelectedBranches.push(value);
        }

        this.BranchesInput.nativeElement.blur();

        this.emitBranchesChanged();
    }

    protected configureDevOpsAction(): void {
        setTimeout(() => {
            this.DevOpsActionLookupFormControl.setValue(
                this.DevOpsActionLookup
            );
        }, 0);
    }

    protected destroyFormControls(): void {
        this.DevOpsSourceControlFormGroup.removeControl(
            [this.SourceControlRoot, 'mainBranch'].join('')
        );

        this.DevOpsSourceControlFormGroup?.removeControl(
            [this.SourceControlRoot, 'branches'].join('')
        );

        this.DevOpsSourceControlFormGroup?.removeControl(
            [this.SourceControlRoot, 'buildPath'].join('')
        );

        this.SelectedBranches = [];

        this.DevOpsSourceControlFormGroup?.removeControl(
            [this.SourceControlRoot, 'organization'].join('')
        );

        this.DevOpsSourceControlFormGroup?.removeControl(
            [this.SourceControlRoot, 'repository'].join('')
        );
    }

    protected emitBranchesChanged(): void {
        if (
            this.SelectedBranches?.length > 0 &&
            (!this.MainBranchFormControl.value ||
                this.SelectedBranches.indexOf(
                    this.MainBranchFormControl.value
                ) < 0)
        ) {
            this.MainBranchFormControl.setValue(
                this.SelectedBranches.find(
                    (branch) => branch === 'main' || branch === 'master'
                ) || this.SelectedBranches[0]
            );
        } else if (this.SelectedBranches?.length <= 0) {
            this.MainBranchFormControl.reset();
        }

        this.BranchesFormControl.setValue(this.SelectedBranches.join(','));

        this.BranchesChanged(this.SelectedBranches || []);
    }

    protected listBranches(): void {
        if (this.UseBranches) {
            this.Loading = true;

            this.appsFlowSvc
                .ListBranches(
                    this.OrganizationFormControl.value,
                    this.RepositoryFormControl.value
                )
                .subscribe((response: BaseModeledResponse<GitHubBranch[]>) => {
                    this.BranchOptions = response.Model;

                    this.Loading = false;

                    if (this.EditingSourceControl?.Branches?.length > 0) {
                        this.SelectedBranches =
                            this.EditingSourceControl.Branches;
                    } else if (this.BranchOptions?.length === 1) {
                        this.BranchesFormControl.setValue(
                            this.BranchOptions[0].Name
                        );

                        this.SelectedBranches = [this.BranchOptions[0].Name];
                    }

                    this.emitBranchesChanged();

                    this.listBuildPaths();
                });
        }
    }

    protected listBuildPaths(): void {
        if (this.UseBuildPath) {
            this.Loading = true;

            this.appsFlowSvc
                .ListBuildPaths(
                    this.OrganizationFormControl.value,
                    this.RepositoryFormControl.value
                )
                .subscribe((response: BaseModeledResponse<string[]>) => {
                    this.BuildPathOptions = response.Model;

                    this.Loading = false;

                    if (this.BuildPathOptions?.length === 1) {
                        this.BuildPathFormControl.setValue(
                            this.BuildPathOptions[0]
                        );
                    }
                });
        }
    }

    protected listOrganizations(): void {
        this.Loading = true;

        this.appsFlowSvc
            .ListOrganizations()
            .subscribe(
                (response: BaseModeledResponse<GitHubOrganization[]>) => {
                    this.OrganizationOptions = response.Model;
                    console.log(
                        'Organization Options: ',
                        this.OrganizationOptions
                    );

                    this.Loading = false;

                    if (this.EditingSourceControl?.Organization) {
                        setTimeout(() => {
                            this.OrganizationFormControl.setValue(
                                this.EditingSourceControl.Organization
                            );

                            this.listRepositories(
                                this.EditingSourceControl?.Repository
                            );
                        }, 0);
                    }
                }
            );
    }

    protected listRepositories(activeRepo: string = null): void {
        this.Loading = true;

        this.appsFlowSvc
            .ListRepositories(this.OrganizationFormControl.value)
            .subscribe((response: BaseModeledResponse<GitHubRepository[]>) => {
                this.RepositoryOptions = response.Model;

                this.Loading = false;

                if (activeRepo) {
                    setTimeout(() => {
                        this.RepositoryFormControl.setValue(activeRepo);

                        this.listBranches();

                        if (!this.UseBranches) {
                            this.listBuildPaths();
                        }
                    }, 0);
                } else if (this.RepositoryOptions?.length <= 0) {
                    this.CreatingRepository = true;
                }
            });
    }

    protected loadProjectHostingDetails(): void {
        if (this.SelectedBranches?.length > 0) {
            this.HostingDetails.Loading = true;

            this.appsFlowSvc.LoadProjectHostingDetails().subscribe(
                (response: BaseModeledResponse<ProjectHostingDetails>) => {
                    this.HostingDetails = response.Model;

                    this.HostingDetails.Loading = false;

                    this.configureDevOpsAction();
                },
                (err) => {
                    this.HostingDetails.Loading = false;
                }
            );
        }
    }

    protected setupFormControls(): void {
        this.destroyFormControls();

        console.log('Source Control: ', this.EditingSourceControl);

        this.DevOpsSourceControlFormGroup.addControl(
            'devOpsActionLookup',
            new FormControl(this.DevOpsActionLookup || '', [])
        );

        this.DevOpsSourceControlFormGroup.addControl(
            [this.SourceControlRoot, 'organization'].join(''),
            new FormControl(
                this.EditingSourceControl.Organization ?? '',
                Validators.required
            )
        );

        this.DevOpsSourceControlFormGroup.addControl(
            [this.SourceControlRoot, 'repository'].join(''),
            new FormControl(
                this.EditingSourceControl.Repository ?? '',
                Validators.required
            )
        );

        if (this.UseBranches) {
            this.DevOpsSourceControlFormGroup.addControl(
                [this.SourceControlRoot, 'branches'].join(''),
                new FormControl(
                    this.EditingSourceControl?.Branches ?? '',
                    Validators.required
                )
            );

            this.SelectedBranches = this.EditingSourceControl?.Branches;

            this.DevOpsSourceControlFormGroup.addControl(
                [this.SourceControlRoot, 'mainBranch'].join(''),
                new FormControl(
                    this.EditingSourceControl.MainBranch ?? '',
                    Validators.required
                )
            );
        }

        if (this.UseBuildPath) {
            this.DevOpsSourceControlFormGroup.addControl(
                [this.SourceControlRoot, 'buildPath'].join(''),
                new FormControl(this.BuildPath ?? '', Validators.required)
            );
        }
    }
}
