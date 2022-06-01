import { Component, Inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BaseModeledResponse } from '@lcu/common';
import {
    EaCEnvironmentAsCode,
    EaCSourceControl,
    Status,
} from '@semanticjs/common';
import { FeedEntry } from '../../models/user-feed.model';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { EaCService } from '../../services/eac.service';
import {
    ApplicationsFlowState,
    GitHubBranch,
    GitHubOrganization,
    GitHubRepository,
} from '../../state/applications-flow.state';

export interface FeedHeaderDialogData {
    // action: FeedItemAction,
    dialogTitle: string;
    type: string;
}

@Component({
    selector: 'lcu-feed-header-dialog',
    templateUrl: './feed-header-dialog.component.html',
    styleUrls: ['./feed-header-dialog.component.scss'],
})
export class FeedHeaderDialogComponent implements OnInit {
    public get ActionIconControl(): AbstractControl {
        return this.FeedHeaderFormGroup?.controls.actionIcon;
    }

    public get ActionLinkControl(): AbstractControl {
        return this.FeedHeaderFormGroup?.controls.actionLink;
    }

    public get ActionTextControl(): AbstractControl {
        return this.FeedHeaderFormGroup?.controls.actionText;
    }

    public get EditorControl(): AbstractControl {
        return this.FeedHeaderFormGroup?.controls.editor;
    }

    public get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    public get TargetBranchFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup.controls.targetBranch;
    }

    public get OrganizationFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup.controls.organization;
    }

    public get SourceBranchFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup.controls.sourceBranch;
    }

    public get RepositoryFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup.controls.repository;
    }

    public get SourceControlFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup.controls.sourceControl;
    }

    public get SourceControlLookups(): Array<string> {
        return this.State.FeedSourceControlLookups
            ? this.State.FeedSourceControlLookups
            : Object.keys(this.SourceControls || {});
    }

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public get SubtitleFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup.controls.subtitle;
    }

    public State: ApplicationsFlowState;

    // public get State(): ApplicationsFlowState {
    //     return this.eacSvc.State;
    // }

    public get TitleFormControl(): AbstractControl {
        return this.FeedHeaderFormGroup?.controls.title;
    }

    public BranchOptions: GitHubBranch[];

    public EditorConfig: AngularEditorConfig;

    public ErrorMessage: string;

    public FeedHeaderFormGroup: FormGroup;

    public Loading: boolean;

    public OrganizationOptions: GitHubOrganization[];

    public RepositoryOptions: GitHubRepository[];

    public SourceControl: EaCSourceControl;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    constructor(
        protected appsFlowSvc: ApplicationsFlowService,
        protected eacSvc: EaCService,
        protected formBldr: FormBuilder,
        public dialogRef: MatDialogRef<FeedHeaderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FeedHeaderDialogData,
        protected snackBar: MatSnackBar
    ) {
        this.EditorConfig = {
            editable: true,
            spellcheck: true,
            height: '250px',
            minHeight: '0',
            maxHeight: 'auto',
            width: 'auto',
            minWidth: '0',
            translate: 'yes',
            enableToolbar: true,
            showToolbar: true,
            placeholder: 'Enter text here...',
            defaultParagraphSeparator: '',
            defaultFontName: '',
            defaultFontSize: '',
            fonts: [
                { class: 'arial', name: 'Arial' },
                { class: 'times-new-roman', name: 'Times New Roman' },
                { class: 'calibri', name: 'Calibri' },
                { class: 'comic-sans-ms', name: 'Comic Sans MS' },
            ],
            customClasses: [
                {
                    name: 'quote',
                    class: 'quote',
                },
                {
                    name: 'redText',
                    class: 'redText',
                },
                {
                    name: 'titleText',
                    class: 'titleText',
                    tag: 'h1',
                },
            ],
            sanitize: true,
            toolbarPosition: 'top',
            toolbarHiddenButtons: [['subscript', 'superscript'], ['fontSize']],
        };

        this.ErrorMessage = null;

        this.Loading = false;

        this.SlicesCount = 5;

        this.Slices = {
            Sources: this.SlicesCount,
        };

        if (this.SourceControlLookups.length === 1) {
            this.SourceControl =
                this.Environment?.Sources[this.SourceControlLookups[0]];
        }
    }

    public ngOnInit(): void {
        this.eacSvc.State.subscribe((state: any) => {
            this.State = state;
        });
        this.setupFeedHeaderForm();
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public HandleAction() {
        if (this.ActionLinkControl.value.startsWith('http')) {
            window.open(this.ActionLinkControl.value, '_blank');
        } else {
            window.location.href = this.ActionLinkControl.value;
        }
    }

    public PullRequestSourceControlChanged(event: MatSelectChange) {
        console.log('sourcecontrol', this.SourceControlFormControl.value);
        this.SourceControl =
            this.SourceControls[this.SourceControlFormControl.value];
        this.listBranches();
    }

    public FeatureBranchSourceControlChanged(event: MatSelectChange) {
        this.SourceControl =
            this.SourceControls[this.SourceControlFormControl.value];
        this.listOrganizations();
    }

    public IsDisabled(): boolean {
        // console.log("valid: ",this.FeedHeaderFormGroup?.valid)
        // console.log("loading: ",this.Loading)
        // console.log("returning ",(!this.FeedHeaderFormGroup?.valid || this.Loading))
        return !this.FeedHeaderFormGroup?.valid || this.Loading;
    }

    public IssueSourceControlChanged(event: MatSelectChange) {
        this.SourceControl =
            this.SourceControls[this.SourceControlFormControl.value];
    }

    public Submit() {
        let returnObject: FeedEntry = {
            ActionIcon: this.ActionIconControl
                ? this.ActionIconControl.value
                : null,
            ActionLink: this.ActionLinkControl
                ? this.ActionLinkControl.value
                : null,
            ActionText: this.ActionTextControl
                ? this.ActionTextControl.value
                : null,
            Avatar: null,
            Content: this.EditorControl ? this.EditorControl.value : null,
            ExpiresAt: null,
            Organization: this.OrganizationFormControl
                ? this.OrganizationFormControl.value
                : null,
            Repository: this.RepositoryFormControl
                ? this.RepositoryFormControl.value
                : null,
            SourceBranch: this.SourceBranchFormControl
                ? this.SourceBranchFormControl.value
                : null,
            SourceControlLookup: this.SourceControlFormControl
                ? this.SourceControlFormControl.value
                : null,
            Subtitle: this.SubtitleFormControl
                ? this.SubtitleFormControl.value
                : null,
            TargetBranch: this.TargetBranchFormControl
                ? this.TargetBranchFormControl.value
                : null,
            Type: this.data.type,
            Title: this.TitleFormControl ? this.TitleFormControl.value : null,
        };
        // console.log('Control: ', returnObject);

        this.eacSvc.SubmitFeedEntry(returnObject).then((res: Status) => {
            // console.log('result: ', res);
            if (res.Code === 0) {
                this.snackBar.open(
                    ` '${this.data.type}' Succesfully Created`,
                    'Dismiss',
                    {
                        duration: 5000,
                    }
                );
                this.CloseDialog();
            } else {
                this.snackBar.open(res.Message, 'Dismiss', {
                    panelClass: 'error',
                });
                this.ErrorMessage = res.Message;
            }
        });

        // console.log("Editor: ", this.EditorControl.value )
    }

    public OrganizationChanged(event: MatSelectChange): void {
        this.RepositoryFormControl.reset();

        this.listRepositories();
    }

    public RepositoryChanged(event: MatSelectChange) {
        this.listBranches();
    }

    //HELPERS

    protected listBranches(): void {
        this.Loading = true;

        console.log('LISTING BRANCHES');

        this.appsFlowSvc
            .ListBranches(
                this.SourceControl?.Organization,
                this.SourceControl?.Repository
            )
            .subscribe((response: BaseModeledResponse<GitHubBranch[]>) => {
                this.BranchOptions = response.Model;
                this.Loading = false;
            });
        // console.log("Loading = ", this.Loading)
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
                    this.Loading = false;
                }
            );
        // console.log("Loading = ", this.Loading)
    }

    protected listRepositories(activeRepo: string = null): void {
        this.Loading = true;

        this.appsFlowSvc
            .ListRepositories(this.OrganizationFormControl.value)
            .subscribe((response: BaseModeledResponse<GitHubRepository[]>) => {
                this.RepositoryOptions = response.Model;

                if (activeRepo) {
                    setTimeout(() => {
                        this.RepositoryFormControl.setValue(activeRepo);

                        this.listBranches();
                        // this.Loading=true;
                    }, 0);
                }
                this.Loading = false;
            });
        // console.log("Loading = ", this.Loading)
    }

    protected setupFeedHeaderForm() {
        this.FeedHeaderFormGroup = this.formBldr.group({});

        switch (this.data.type) {
            case 'Announcement':
                this.setupAnnouncementForm();
                break;
            case 'PullRequest':
                this.setupPRForm();
                break;
            case 'OpenIssue':
                this.setupIssueForm();
                break;
            case 'CreateBranch':
                this.setupFeatureBranchForm();
                break;
            default:
                //
                break;
        }
    }

    protected setupAnnouncementForm() {
        this.setupBasicForm();

        this.FeedHeaderFormGroup.addControl(
            'subtitle',
            this.formBldr.control('')
        );

        this.FeedHeaderFormGroup.addControl(
            'actionText',
            this.formBldr.control('')
        );

        this.FeedHeaderFormGroup.addControl(
            'actionLink',
            this.formBldr.control('')
        );
        this.FeedHeaderFormGroup.addControl(
            'actionIcon',
            this.formBldr.control('')
        );
    }

    protected setupPRForm() {
        this.listBranches();
        this.setupIssueForm();
        this.setupBranchesForm();
    }

    protected setupBasicForm() {
        this.FeedHeaderFormGroup.addControl(
            'title',
            this.formBldr.control('', [Validators.required])
        );

        this.FeedHeaderFormGroup.addControl(
            'editor',
            this.formBldr.control('')
        );
    }

    protected setupIssueForm() {
        this.setupBasicForm();

        this.setupSourceControlForm();
    }

    protected setupFeatureBranchForm() {
        this.setupSourceControlForm();

        this.FeedHeaderFormGroup.addControl(
            'organization',
            this.formBldr.control('', [Validators.required])
        );

        this.FeedHeaderFormGroup.addControl(
            'repository',
            this.formBldr.control('', [Validators.required])
        );

        this.setupBranchesForm();
    }

    protected setupSourceControlForm() {
        this.FeedHeaderFormGroup.addControl(
            'sourceControl',
            this.formBldr.control('', [Validators.required])
        );
    }

    protected setupBranchesForm() {
        this.FeedHeaderFormGroup.addControl(
            'targetBranch',
            this.formBldr.control('', [Validators.required])
        );

        this.FeedHeaderFormGroup.addControl(
            'sourceBranch',
            this.formBldr.control('', [Validators.required])
        );
    }
}
