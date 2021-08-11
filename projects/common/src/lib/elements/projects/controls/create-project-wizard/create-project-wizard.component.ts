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
import { ApplicationsFlowEventsService } from './../../../../services/applications-flow-events.service';

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
    protected appsFlowSvc: ApplicationsFlowService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.State = new ApplicationsFlowState();
  }
  //  Life Cycle
  public ngAfterViewInit(): void {
    this.handleStateChange();
  }

  public ngOnInit(): void {
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
  public Cancel() {
    this.appsFlowEventsSvc.SetCreatingProject(false);
  }
  
  public CancelCreateRepository(): void {
    this.State.GitHub.CreatingRepository = false;
  }

  // public ConnectGitHubProvider(): void {
  //   const reidrectUri = location.pathname + location.search;

  //   window.location.href = `/.oauth/github?redirectUri=${reidrectUri}`;
  // }

  public CreateRepository(): void {
    this.State.GitHub.CreatingRepository = true;

    this.ProjectFormGroup.get('repoDetails').get('repository').reset();
  }

  public CreateProject(): void {
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

    req.ProjectName = `@${req.Organization}/${req.Repository}@${req.Branch}`;

    // req.HostingOption = '';

    this.appsFlowEventsSvc.BootUserProject(req);
  }

  public OrganizationChanged(event: MatSelectChange): void {
    const org = this.ProjectFormGroup.get('repoDetails').get('organization');

    if (org !== event.value) {
      this.ProjectFormGroup.get('repoDetails').get('repository').reset();

      this.listRepositories();
    }
  }

  public RefreshOrganizations(): void {
    // this.State.GitHub.Loading = true;
    this.listOrganizations();

    this.ProjectFormGroup.get('repoDetails').reset();
  }

  public RepositoryChanged(event: MatSelectChange): void {
    const repo = this.ProjectFormGroup.get('repoDetails').get('repository');

    if (repo !== event.value) {
      this.ProjectFormGroup.get('repoDetails').get('branch').reset();

      this.listBranches();
    }
  }

  public SaveRepository(): void {
    this.State.GitHub.Loading = true;

    const org =
      this.ProjectFormGroup.get('repoDetails').get('organization').value;

    const repoName =
      this.ProjectFormGroup.get('repoDetails').get('repository').value;

    this.appsFlowSvc
      .CreateRepository(org, repoName)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.listRepositories(repoName);

          this.State.GitHub.CreatingRepository = false;
        } else {
          //  TODO:  Need to surface an error to the user...

          this.State.GitHub.Loading = false;
        }
      });
  }

  public SetupRepository(): void {
    this.determineStep();
  }

  //  Helpers
  protected determineStep(): void {
    let index = 0;

    if (this.IsOrganizationValid && this.IsRepositoryValid) {
      index = 1;
    }

    setTimeout(() => {
      this.Stepper.selectedIndex = index;
    }, 0);
  }

  protected handleStateChange(): void {
    this.State.Loading = true;

    this.determineStep();

    this.listOrganizations();
  }

  protected listBranches(): void {
    this.State.GitHub.Loading = true;

    this.appsFlowSvc
      .ListBranches(
        this.ProjectFormGroup.get('repoDetails').get('organization').value,
        this.ProjectFormGroup.get('repoDetails').get('repository').value
      )
      .subscribe((response: BaseModeledResponse<GitHubBranch[]>) => {
        this.State.GitHub.BranchOptions = response.Model;

        this.State.GitHub.Loading = false;

        if (this.State.GitHub.BranchOptions?.length === 1) {
          this.ProjectFormGroup.get('repoDetails')
            .get('branch')
            .setValue(this.State.GitHub.BranchOptions[0].Name);
        }

        this.loadProjectHostingDetails();

        console.log(this.State);
      });
  }

  protected listOrganizations(): void {
    this.State.Loading = true;

    this.appsFlowSvc
      .ListOrganizations()
      .subscribe((response: BaseModeledResponse<GitHubOrganization[]>) => {
        this.State.GitHub.OrganizationOptions = response.Model;

        this.State.Loading = false;

        console.log(this.State);
      });
  }

  protected listRepositories(activeRepo: string = null): void {
    this.State.GitHub.Loading = true;

    this.appsFlowSvc
      .ListRepositories(
        this.ProjectFormGroup.get('repoDetails').get('organization').value
      )
      .subscribe((response: BaseModeledResponse<GitHubRepository[]>) => {
        this.State.GitHub.RepositoryOptions = response.Model;

        this.State.GitHub.Loading = false;

        if (activeRepo) {
          setTimeout(() => {
            this.ProjectFormGroup.get('repoDetails')
              .get('repository')
              .setValue(activeRepo);

            this.listBranches();
          }, 0);
        } else if (this.State.GitHub.RepositoryOptions?.length <= 0) {
          this.State.GitHub.CreatingRepository = true;
        }
      });
  }

  protected loadProjectHostingDetails(): void {
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
