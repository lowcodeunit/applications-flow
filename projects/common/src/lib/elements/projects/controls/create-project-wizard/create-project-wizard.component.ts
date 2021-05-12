import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { BaseResponse, BaseModeledResponse } from '@lcu/common';
import { ApplicationsFlowService } from '../../../../services/applications-flow.service';
import {
  ApplicationsFlowState,
  EstablishProjectRequest,
  GitHubBranch,
  GitHubOrganization,
  GitHubRepository,
  ProjectHostingDetails,
} from '../../../../state/applications-flow.state';

@Component({
  selector: 'lcu-create-project-wizard',
  templateUrl: './create-project-wizard.component.html',
  styleUrls: ['./create-project-wizard.component.scss'],
})
export class CreateProjectWizardComponent implements AfterViewInit, OnInit {
  //  Fields

  //  Properties
  public get AreProjectDetailsValid(): boolean {
    return this.ProjectFormGroup.get('projectDetails')?.valid;
  }

  public get IsBranchValid(): boolean {
    return this.ProjectFormGroup.get('repoDetails').get('branch').valid;
  }

  public get IsOrganizationValid(): boolean {
    return this.ProjectFormGroup.get('repoDetails').get('organization').valid;
  }

  public get IsRepositoryValid(): boolean {
    return this.ProjectFormGroup.get('repoDetails').get('repository').valid;
  }

  public ProjectFormGroup: FormGroup;

  public State: ApplicationsFlowState;

  @ViewChild('projectStepper')
  public Stepper: MatStepper;

  //  Constructors
  constructor(
    protected formBuilder: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService
  ) {
    this.State = new ApplicationsFlowState();
  }
  //  Life Cycle
  public ngAfterViewInit() {
    this.handleStateChange();
  }

  public ngOnInit() {
    this.ProjectFormGroup = this.formBuilder.group({
      repoDetails: this.formBuilder.group({
        branch: ['', Validators.required],
        organization: ['', Validators.required],
        repository: ['', Validators.required],
      }),
      projectDetails: this.formBuilder.group({}),
    });
  }

  //  API Methods
  public CancelCreateRepository() {
    this.State.GitHub.CreatingRepository = false;
  }

  public ConnectGitHubProvider() {
    const reidrectUri = location.pathname + location.search;

    window.location.href = `/.oauth/github?redirectUri=${reidrectUri}`;
  }

  public CreateRepository() {
    this.State.GitHub.CreatingRepository = true;

    this.ProjectFormGroup.get('repoDetails').get('repository').reset();
  }

  public CreateProject() {
    this.State.Loading = true;

    const repoDetails = this.ProjectFormGroup.get('repoDetails');

    const projectDetails = this.ProjectFormGroup.get('projectDetails');

    const req: EstablishProjectRequest = {
      Branch: repoDetails.get('branch').value,
      BuildScript: projectDetails.get('buildScript').value,
      // HostingOption: projectDetails.get('hostingOption').value,
      Organization: repoDetails.get('organization').value,
      OutputFolder: projectDetails.get('outputFolder').value,
      // ProjectName: projectDetails.get('projectName').value,
      Repository: repoDetails.get('repository').value,
    };

    req.ProjectName = `${req.Organization} ${req.Repository} ${req.Branch}`;

    // req.HostingOption = '';

    this.appsFlowSvc
      .BootUserEnterprise(req)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          window.location.href = window.location.href;
        } else {
          this.State.Loading = false;
        }

        console.log(response);
      });
  }

  public OrganizationChanged(event: MatSelectChange) {
    const org = this.ProjectFormGroup.get('repoDetails').get('organization');

    if (org !== event.value) {
      this.ProjectFormGroup.get('repoDetails').get('repository').reset();

      this.listRepositories();
    }
  }

  public RefreshOrganizations() {
    // this.State.GitHub.Loading = true;

    this.ProjectFormGroup.get('repoDetails').reset();
  }

  public RepositoryChanged(event: MatSelectChange) {
    const repo = this.ProjectFormGroup.get('repoDetails').get('repository');

    if (repo !== event.value) {
      this.ProjectFormGroup.get('repoDetails').get('branch').reset();

      this.listBranches();
    }
  }

  public SaveRepository() {
    alert(this.ProjectFormGroup.get('repoDetails').get('repository').value);

    this.State.GitHub.CreatingRepository = false;
  }

  public SetupRepository() {
    this.determineStep();
  }

  //  Helpers
  protected determineStep() {
    let index = 0;

    if (this.State.GitHub.HasConnection) {
      if (this.IsOrganizationValid && this.IsRepositoryValid) {
        index = 2;
      } else {
        index = 1;
      }
    }

    setTimeout(() => {
      this.Stepper.selectedIndex = index;
    }, 0);
  }

  protected handleStateChange() {
    this.State.Loading = true;

    this.appsFlowSvc
      .HasValidConnection()
      .subscribe((response: BaseResponse) => {
        this.State.GitHub.HasConnection = response.Status.Code === 0;

        this.determineStep();

        if (this.State.GitHub.HasConnection) {
          this.listOrganizations();
        } else {
          this.State.Loading = false;
        }
      });
  }

  protected listBranches() {
    this.State.GitHub.Loading = true;

    this.appsFlowSvc
      .ListBranches(
        this.ProjectFormGroup.get('repoDetails').get('organization').value,
        this.ProjectFormGroup.get('repoDetails').get('repository').value
      )
      .subscribe((response: BaseModeledResponse<GitHubBranch[]>) => {
        this.State.GitHub.BranchOptions = response.Model;

        this.State.GitHub.Loading = false;

        this.loadProjectHostingDetails();

        console.log(this.State);
      });
  }

  protected listOrganizations() {
    this.appsFlowSvc
      .ListOrganizations()
      .subscribe((response: BaseModeledResponse<GitHubOrganization[]>) => {
        this.State.GitHub.OrganizationOptions = response.Model;

        this.State.Loading = false;

        console.log(this.State);
      });
  }

  protected listRepositories() {
    this.State.GitHub.Loading = true;

    this.appsFlowSvc
      .ListRepositories(
        this.ProjectFormGroup.get('repoDetails').get('organization').value
      )
      .subscribe((response: BaseModeledResponse<GitHubRepository[]>) => {
        this.State.GitHub.RepositoryOptions = response.Model;

        this.State.GitHub.Loading = false;

        console.log(this.State);
      });
  }

  protected loadProjectHostingDetails() {
    this.State.HostingDetails.Loading = true;

    this.appsFlowSvc
      .LoadProjectHostingDetails(
        this.ProjectFormGroup.get('repoDetails').get('organization').value,
        this.ProjectFormGroup.get('repoDetails').get('repository').value,
        this.ProjectFormGroup.get('repoDetails').get('branch').value
      )
      .subscribe((response: BaseModeledResponse<ProjectHostingDetails>) => {
        this.State.HostingDetails = response.Model;

        this.State.HostingDetails.Loading = false;

        console.log(this.State);
      });
  }
}
