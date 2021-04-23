import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { ApplicationsFlowState } from './../../state/applications-flow.state';

export class ApplicationsFlowProjectsElementState {}

export class ApplicationsFlowProjectsContext extends LCUElementContext<ApplicationsFlowProjectsElementState> {}

export const SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT =
  'applications-flow-projects-element';

@Component({
  selector: SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ApplicationsFlowProjectsElementComponent
  extends LcuElementComponent<ApplicationsFlowProjectsContext>
  implements OnInit {
  //  Fields

  //  Properties
  public get IsBranchValid(): boolean {
    return this.ProjectFormGroup.get('repoDetails').get('branch').valid;
  }

  public get IsOrganizationValid(): boolean {
    return this.ProjectFormGroup.get('repoDetails').get('organization').valid;
  }

  public get IsRepositoryValid(): boolean {
    return this.ProjectFormGroup.get('repoDetails').get('repository').valid;
  }

  public get IsTemplateValid(): boolean {
    return this.ProjectFormGroup.get('projectDetails').get('template').valid;
  }

  public get IsTemplateTypeValid(): boolean {
    return this.ProjectFormGroup.get('projectDetails').get('templateType')
      .valid;
  }

  public ProjectFormGroup: FormGroup;

  public State: ApplicationsFlowState;

  @ViewChild('providerStepper')
  public Stepper: MatStepper;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected formBuilder: FormBuilder
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.ProjectFormGroup = this.formBuilder.group({
      repoDetails: this.formBuilder.group({
        branch: ['', Validators.required],
        organization: ['', Validators.required],
        repository: ['', Validators.required],
      }),
      projectDetails: this.formBuilder.group({
        apiLocation: [''],
        appLocation: ['', Validators.required],
        outputLocation: ['', Validators.required],
        template: ['', Validators.required],
        templateType: ['', Validators.required],
      }),
    });

    // this.handleStateChange();
  }

  //  API Methods
  public CancelCreateRepository() {
    this.State.GitHub.CreatingRepository = false;
  }

  public CreateRepository() {
    this.State.GitHub.CreatingRepository = true;

    this.ProjectFormGroup.get('repoDetails').get('repository').reset();
  }

  public CreateProject() {
    this.State.Loading = true;
  }

  public OrganizationChanged(event: MatSelectChange) {
    const org = this.ProjectFormGroup.get('repoDetails').get('organization');

    if (org !== event.value) {
      this.ProjectFormGroup.get('repoDetails').get('repository').reset();
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
    }
  }

  public SaveRepository() {
    alert(this.ProjectFormGroup.get('repoDetails').get('repository').value);

    this.State.GitHub.CreatingRepository = false;
  }

  public SetupRepository() {
    this.determineStep();
  }

  public TempGitHubConnect() {
    this.State.GitHub.HasConnection = true;

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

    this.Stepper.selectedIndex = index;
  }

  protected handleStateChange() {
    this.determineStep();
  }
}
