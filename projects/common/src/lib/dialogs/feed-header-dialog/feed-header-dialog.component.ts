import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BaseModeledResponse } from '@lcu/common';
import { EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState, GitHubBranch, GitHubOrganization, GitHubRepository } from '../../state/applications-flow.state';

export interface FeedHeaderDialogData {
  dialogTitle: string,
  type: string,
  sourceControlLookup: string
}

@Component({
  selector: 'lcu-feed-header-dialog',
  templateUrl: './feed-header-dialog.component.html',
  styleUrls: ['./feed-header-dialog.component.scss']
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

  public get BaseBranchFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.baseBranch;
  }

  public get CompareBranchFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.compareBranch;
  }

  public get EditorControl(): AbstractControl {
    return this.FeedHeaderFormGroup?.controls.editor;
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[
      this.State?.EaC?.Enterprise?.PrimaryEnvironment
    ];
  }

  public get NewBranchFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.newBranch;
  }

  public get OrganizationFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.organization;
  }

  public get ParentBranchFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.parentBranch;
  }

  public get RepositoryFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.repository;
  }


  public get SourceControlFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.sourceControl;
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment?.Sources || {};
  }

  public get SubtitleFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup.controls.subtitle;
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public get TitleFormControl(): AbstractControl {
    return this.FeedHeaderFormGroup?.controls.title;
  }

  public BranchOptions: GitHubBranch[];

  public EditorConfig: AngularEditorConfig;

  public FeedHeaderFormGroup: FormGroup;

  public OrganizationOptions: GitHubOrganization[];

  public RepositoryOptions: GitHubRepository[];

  public SourceControl: EaCSourceControl;

  public Slices: { [key: string]: number };

  public SlicesCount: number;




  constructor(protected appsFlowSvc: ApplicationsFlowService,
    protected eacSvc: EaCService,
    protected formBldr: FormBuilder,
    public dialogRef: MatDialogRef<FeedHeaderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeedHeaderDialogData,) {
      
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
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
      ],
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['subscript', 'superscript'],
        ['fontSize']
      ]
    };

    this.SlicesCount = 5;

    this.Slices = {
      Sources: this.SlicesCount,
    };

    if(this.data.sourceControlLookup){
      this.SourceControl = this.Environment?.Sources[this.data.sourceControlLookup];
    }
   }

  public ngOnInit(): void {
    this.setupFeedHeaderForm();
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public HandleAction(){
    if (this.ActionLinkControl.value.startsWith('http')) {
      window.open(this.ActionLinkControl.value, '_blank');
    } else {
      window.location.href = this.ActionLinkControl.value;
    }
  }

  public PullRequestSourceControlChanged(event: MatSelectChange){
    this.SourceControl = this.SourceControlFormControl.value;
    this.listBranches();

  }

  public FeatureBranchSourceControlChanged(event: MatSelectChange){
    this.SourceControl = this.SourceControlFormControl.value;
    this.listOrganizations();

  }

  public Submit(){
    console.log("Title: ", this.TitleFormControl.value )

    console.log("Editor: ", this.EditorControl.value )
  }

  public OrganizationChanged(event: MatSelectChange): void {

    this.RepositoryFormControl.reset();


    this.listRepositories();
  }

  public RepositoryChanged(event: MatSelectChange){
    this.listBranches();
  }

  //HELPERS

  protected listBranches(): void {
    // this.Loading = true;

      this.appsFlowSvc
        .ListBranches(
          this.SourceControl?.Organization,
          this.SourceControl?.Repository
        )
        .subscribe((response: BaseModeledResponse<GitHubBranch[]>) => {
          this.BranchOptions = response.Model;

          // this.Loading = false;

          // if (this.EditingSourceControl?.Branches?.length > 0) {
          //   this.SelectedBranches = this.EditingSourceControl.Branches;
          // } else if (this.BranchOptions?.length === 1) {
          //   this.BranchesFormControl.setValue(this.BranchOptions[0].Name);

          //   this.SelectedBranches = [this.BranchOptions[0].Name];
          // }

        });
    
  }

  protected listOrganizations(): void {
    // this.Loading = true;

    this.appsFlowSvc
      .ListOrganizations()
      .subscribe((response: BaseModeledResponse<GitHubOrganization[]>) => {
        this.OrganizationOptions = response.Model;
        console.log("Organization Options: ", this.OrganizationOptions);

        // this.Loading = false;

        if (this.SourceControl?.Organization) {
          setTimeout(() => {
            this.OrganizationFormControl.setValue(
              this.SourceControl.Organization
            );

            this.listRepositories(this.SourceControl?.Repository);
          }, 0);
        }
      });
  }

  protected listRepositories(activeRepo: string = null): void {
    // this.Loading = true;

    this.appsFlowSvc
      .ListRepositories(this.OrganizationFormControl.value)
      .subscribe((response: BaseModeledResponse<GitHubRepository[]>) => {
        this.RepositoryOptions = response.Model;

        // this.Loading = false;

        if (activeRepo) {
          setTimeout(() => {
            this.RepositoryFormControl.setValue(activeRepo);

            this.listBranches();

          }, 0);
        } 
      });
  }

  

  protected setupFeedHeaderForm(){
    this.FeedHeaderFormGroup = this.formBldr.group({});

    switch ( this.data.type ) {
      case "announcement":
        this.setupAnnouncementForm();
          break;
      case "pr":
        this.setupPRForm();
          break;
      case "issue":
        this.setupIssueForm();
          break;
      case "fb":
        this.setupFeatureBranchForm();
          break;
      default: 
          // 
          break;
   }

  }

  protected setupAnnouncementForm(){
    this.setupIssueForm();

    this.FeedHeaderFormGroup.addControl(
      'subtitle',
      this.formBldr.control(
        ''
      )
    );

    this.FeedHeaderFormGroup.addControl(
      'actionText',
      this.formBldr.control(
        ''
      )
    );

    this.FeedHeaderFormGroup.addControl(
      'actionLink',
      this.formBldr.control(
        ''
      )
    );
    this.FeedHeaderFormGroup.addControl(
      'actionIcon',
      this.formBldr.control(
        ''
      )
    );


  }

  protected setupPRForm(){
    this.listBranches();
    this.setupBasicForm();

  
    this.FeedHeaderFormGroup.addControl(
      'baseBranch',
      this.formBldr.control(
        ''
      )
    );

    this.FeedHeaderFormGroup.addControl(
      'compareBranch',
      this.formBldr.control(
        ''
      )
    );


  }

protected setupBasicForm(){
  this.FeedHeaderFormGroup.addControl(
    'title',
    this.formBldr.control(
      '',[Validators.required]
    )
  );

  this.FeedHeaderFormGroup.addControl(
    'editor',
    this.formBldr.control(
      ''
    )
  );
}


  protected setupIssueForm(){
    this.setupBasicForm();
    
    this.setupSourceControlForm();

  }

  protected setupFeatureBranchForm(){

    this.setupSourceControlForm();

    this.FeedHeaderFormGroup.addControl(
      'organization',
      this.formBldr.control(
        ''
      )
    );

    this.FeedHeaderFormGroup.addControl(
      'repository',
      this.formBldr.control(
        ''
      )
    );

    this.FeedHeaderFormGroup.addControl(
      'newBranch',
      this.formBldr.control(
        ''
      )
    );

    this.FeedHeaderFormGroup.addControl(
      'parentBranch',
      this.formBldr.control(
        ''
      )
    );

  }

  protected setupSourceControlForm(){
    this.FeedHeaderFormGroup.addControl(
      'sourceControl',
      this.formBldr.control(
        ''
      )
    );
  }

}
