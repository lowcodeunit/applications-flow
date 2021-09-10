import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { BaseResponse, BaseModeledResponse } from '@lcu/common';
import { ApplicationsFlowService } from '../../../../services/applications-flow.service';
import { ProjectHostingDetails } from '../../../../state/applications-flow.state';
import { SourceControlFormControlsComponent } from '../forms/source-control/source-control.component';
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
    return this.ProjectDetailsFormGroup?.valid;
  }

  public HostingDetails: ProjectHostingDetails;

  public get IsBranchValid(): boolean {
    return this.SourceControl?.SelectedBranches?.length > 0;
  }

  public get IsOrganizationValid(): boolean {
    return this.RepoDetailsFormGroup.get('organization')?.valid;
  }

  public get IsRepositoryValid(): boolean {
    return this.RepoDetailsFormGroup.get('repository')?.valid;
  }

  public Loading?: boolean;

  public get ProjectDetailsFormGroup(): FormGroup {
    return this.ProjectFormGroup.get('projectDetails') as FormGroup;
  }

  public ProjectFormGroup: FormGroup;

  public get RepoDetailsFormGroup(): FormGroup {
    return this.ProjectFormGroup.get('repoDetails') as FormGroup;
  }

  @ViewChild(SourceControlFormControlsComponent)
  public SourceControl: SourceControlFormControlsComponent;

  @ViewChild('projectStepper')
  public Stepper: MatStepper;

  //  Constructors
  constructor(
    protected formBuilder: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.HostingDetails = new ProjectHostingDetails();
  }
  //  Life Cycle
  public ngAfterViewInit(): void {
    this.handleStateChange();
  }

  public ngOnInit(): void {
    this.ProjectFormGroup = this.formBuilder.group({
      repoDetails: this.formBuilder.group({}),
      projectDetails: this.formBuilder.group({}),
    });
  }

  //  API Methods
  public Cancel() {
    this.appsFlowEventsSvc.SetCreatingProject(false);
  }

  public ConfigureRepository() {
    this.loadProjectHostingDetails();
  }

  public CreateProject(): void {
    this.Loading = true;

    // const req: ProjectState = {
    //   Branch: this.SourceControl.SelectedBranches.join(','),
    //   BuildScript: this.ProjectDetailsFormGroup.get('buildScript').value,
    //   // HostingOption: projectDetails.get('hostingOption').value,
    //   Organization: this.RepoDetailsFormGroup.get('organization').value,
    //   OutputFolder: this.ProjectDetailsFormGroup.get('outputFolder').value,
    //   // ProjectName: projectDetails.get('projectName').value,
    //   Repository: this.RepoDetailsFormGroup.get('repository').value,
    // };

    // const src: EaCSourceControl = {
    //   Name: '',
    //   Type: 'GitHub',
    //   Organization: this.RepoDetailsFormGroup.get('organization').value,
    //   Repository: this.RepoDetailsFormGroup.get('repository').value,
    //   Branches: this.SourceControl.SelectedBranches.join(','),
    // };

    // const doa: EaCDevOpsAction = {
    //   Type: 'NPM',
    //   Name: 'NPM Deploy',
    //   Lookup: 'npm-deploy',
    //   Output: this.ProjectDetailsFormGroup.get('outputFolder').value,
    //   DeployCommand: 'npm run deploy',
    //   InstallCommand: 'npm ci',
    //   NPMRegistry: 'https://registry.npmjs.org/',
    // };

    // const art: EaCArtifact = {
    //   Type: 'NPM',
    //   Name: 'NPM Deploy',
    //   Lookup: 'npm-deploy',
    //   Output: this.ProjectDetailsFormGroup.get('output').value,
    //   DeployCommand: 'npm run deploy',
    //   InstallCommand: 'npm ci',
    //   NPMRegistry: 'https://registry.npmjs.org/',
    // };

    // const proj: EaCProjectAsCode = {
    //   Project: {
    //     Name: `${src.Organization} ${src.Repository} ${src.Branches}`,
    //   },
    // };

    // this.appsFlowEventsSvc.SaveProject(req);
  }

  public SetupRepository(): void {
    this.determineStep();
  }

  //  Helpers
  protected determineStep(): void {
    let index = 0;

    if (
      this.IsOrganizationValid &&
      this.IsRepositoryValid &&
      this.IsBranchValid
    ) {
      index = 1;
    }

    setTimeout(() => {
      this.Stepper.selectedIndex = index;
    }, 0);
  }

  protected handleStateChange(): void {
    this.determineStep();
  }

  protected loadProjectHostingDetails(): void {
    this.HostingDetails.Loading = true;

    this.appsFlowSvc
      .LoadProjectHostingDetails(
        this.RepoDetailsFormGroup.get('organization').value,
        this.RepoDetailsFormGroup.get('repository').value,
        this.SourceControl?.SelectedBranches?.join(',')
      )
      .subscribe((response: BaseModeledResponse<ProjectHostingDetails>) => {
        this.HostingDetails = response.Model;

        this.HostingDetails.Loading = false;

        this.Stepper.next();
      });
  }
}
