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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
    FormControl,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { BaseResponse, BaseModeledResponse } from '@lcu/common';
import {
    GitHubBranch,
    GitHubOrganization,
    GitHubRepository,
} from '../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../../../../services/applications-flow.service';
import { EaCSourceControl } from '@semanticjs/common';

@Component({
    selector: 'lcu-source-control-form-controls',
    templateUrl: './source-control.component.html',
    styleUrls: ['./source-control.component.scss'],
})
export class SourceControlFormControlsComponent
    implements AfterViewInit, OnDestroy, OnInit
{
    //  Fields

    //  Properties
    public get BranchesFormControl(): AbstractControl {
        return this.FormGroup.get(this.SourceControlRoot + 'branches');
    }

    @Output('branches-changed')
    public BranchesChanged: EventEmitter<Array<string>>;

    @Input('branches-disabled')
    public BranchesDisabled: boolean;

    @ViewChild('branches')
    public BranchesInput: ElementRef<HTMLInputElement>;

    public BranchOptions: GitHubBranch[];

    @Input('build-path')
    public BuildPath: string;

    @Input('build-path-disabled')
    public BuildPathDisabled: boolean;

    public get BuildPathFormControl(): AbstractControl {
        return this.FormGroup.get(this.SourceControlRoot + 'buildPath');
    }

    public BuildPathOptions: string[];

    public CreatingRepository: boolean;

    @Input('form-group')
    public FormGroup: FormGroup;

    public Loading: boolean;

    public get MainBranchFormControl(): AbstractControl {
        return this.FormGroup.get(this.SourceControlRoot + 'mainBranch');
    }

    @Input('org-disabled')
    public OrganizationDisabled: boolean;

    public get OrganizationFormControl(): AbstractControl {
        return this.FormGroup.get(this.SourceControlRoot + 'organization');
    }

    public OrganizationOptions: GitHubOrganization[];

    public get RepositoryFormControl(): AbstractControl {
        return this.FormGroup.get(this.SourceControlRoot + 'repository');
    }

    @Input('repo-disabled')
    public RepositoryDisabled: boolean;

    public RepositoryOptions: GitHubRepository[];

    public SelectedBranches: string[];

    public readonly SeparatorKeysCodes = [ENTER, COMMA] as const;

    @Input('source-control')
    public SourceControl: EaCSourceControl;

    @Input('source-control-root')
    public SourceControlRoot: string;

    @Input('use-branches')
    public UseBranches: boolean;

    @Input('use-build-path')
    public UseBuildPath: boolean;

    public IsBranchesFormValid: boolean;

    public IsBuildPathValid: boolean;

    public IsOrgFormValid: boolean;

    public IsRepoFormValid: boolean;

    //  Constructors
    constructor(
        protected formBuilder: FormBuilder,
        protected appsFlowSvc: ApplicationsFlowService
    ) {
        this.BranchesChanged = new EventEmitter();

        this.SelectedBranches = [];

        this.SourceControl = {};

        this.SourceControlRoot = '';

        this.UseBranches = true;
    }

    //  Life Cycle
    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.destroyFormControls();
    }

    public ngOnInit(): void {
        this.setupFormControls();

        this.RefreshOrganizations();
    }

    //  API Methods
    public AddBranchOption(event: MatChipInputEvent): void {
        this.addBranchOption(event.value);

        event.input.value = '';
    }

    public BranchOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.addBranchOption(event.option.value);
    }

    public BuildPathChanged(event: MatSelectChange): void {
        this.IsBuildPathValid = this.BuildPathFormControl.valid;
    }

    public CreateRepository(): void {
        this.CreatingRepository = true;

        this.RepositoryFormControl.reset();
    }

    public CancelCreateRepository(): void {
        this.CreatingRepository = false;
    }

    public MainBranchChanged(event: MatSelectChange): void {
        this.emitBranchesChanged();
    }

    public OrganizationChanged(event: MatSelectChange): void {
        const org = this.OrganizationFormControl;

        this.IsOrgFormValid = this.OrganizationFormControl.valid;

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

        this.IsRepoFormValid = this.RepositoryFormControl.valid;

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

    //  Helpers
    protected addBranchOption(value: string): void {
        value = (value || '').trim();

        if (value && this.SelectedBranches.indexOf(value) < 0) {
            this.SelectedBranches.push(value);
        }

        this.BranchesInput.nativeElement.blur();

        this.IsBranchesFormValid = this.BranchesFormControl.valid;

        this.emitBranchesChanged();
    }

    protected destroyFormControls(): void {
        this.FormGroup.removeControl(
            [this.SourceControlRoot, 'mainBranch'].join('')
        );

        this.FormGroup.removeControl(
            [this.SourceControlRoot, 'branches'].join('')
        );

        this.FormGroup.removeControl(
            [this.SourceControlRoot, 'buildPath'].join('')
        );

        this.SelectedBranches = [];

        this.FormGroup.removeControl(
            [this.SourceControlRoot, 'organization'].join('')
        );

        this.FormGroup.removeControl(
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

        this.BranchesChanged.emit(this.SelectedBranches || []);
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

                    if (this.SourceControl?.Branches?.length > 0) {
                        this.SelectedBranches = this.SourceControl.Branches;
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

                    this.Loading = false;

                    if (this.SourceControl?.Organization) {
                        setTimeout(() => {
                            this.OrganizationFormControl.setValue(
                                this.SourceControl.Organization
                            );

                            this.listRepositories(
                                this.SourceControl?.Repository
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

    protected setupFormControls(): void {
        this.destroyFormControls();

        this.FormGroup.addControl(
            [this.SourceControlRoot, 'organization'].join(''),
            new FormControl(
                this.SourceControl.Organization ?? '',
                Validators.required
            )
        );

        this.IsOrgFormValid = this.OrganizationFormControl.valid;

        this.FormGroup.addControl(
            [this.SourceControlRoot, 'repository'].join(''),
            new FormControl(
                this.SourceControl.Repository ?? '',
                Validators.required
            )
        );

        this.IsRepoFormValid = this.RepositoryFormControl.valid;

        if (this.UseBranches) {
            this.FormGroup.addControl(
                [this.SourceControlRoot, 'branches'].join(''),
                new FormControl(
                    this.SourceControl?.Branches ?? '',
                    Validators.required
                )
            );
            this.IsBranchesFormValid = this.BranchesFormControl.valid;

            this.SelectedBranches = this.SourceControl?.Branches;

            this.FormGroup.addControl(
                [this.SourceControlRoot, 'mainBranch'].join(''),
                new FormControl(
                    this.SourceControl.MainBranch ?? '',
                    Validators.required
                )
            );
        }

        if (this.UseBuildPath) {
            this.FormGroup.addControl(
                [this.SourceControlRoot, 'buildPath'].join(''),
                new FormControl(this.BuildPath ?? '', Validators.required)
            );

            this.IsBuildPathValid = this.BuildPathFormControl.valid;
        }
    }
}
