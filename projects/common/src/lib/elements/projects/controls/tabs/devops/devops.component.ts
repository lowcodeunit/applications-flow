import { FormsService } from '../../../../../services/forms.service';
import { CardFormConfigModel } from '../../../../../models/card-form-config.model';
import { DomainModel } from '../../../../../models/domain.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ApplicationsFlowEventsService,
  SaveEnvironmentAsCodeEventRequest,
} from '../../../../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCArtifact,
  EaCDevOpsAction,
  EaCEnvironmentAsCode,
  EaCProcessor,
  EaCProjectAsCode,
  EaCSourceControl,
} from '../../../../../models/eac.models';
import { BaseModeledResponse, Guid } from '@lcu/common';
import { MatSelectChange } from '@angular/material/select';
import { SourceControlFormControlsComponent } from '../../forms/source-control/source-control.component';
import { ProjectHostingDetails } from '../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../../../../services/applications-flow.service';
import { HostingDetailsFormGroupComponent } from '../../hosting-details-form-group/hosting-details-form-group.component';

@Component({
  selector: 'lcu-devops',
  templateUrl: './devops.component.html',
  styleUrls: ['./devops.component.scss'],
})
export class DevOpsComponent implements OnInit {
  //  Fields

  //  Properties
  public DevOpsFormGroup: FormGroup;

  public get Artifact(): EaCArtifact {
    return this.Data.Environment.Artifacts && this.ArtifactLookup
      ? this.Data.Environment.Artifacts[this.ArtifactLookup] || {}
      : {};
  }

  public get ArtifactLookup(): string {
    const artLookup = this.DevOpsAction?.ArtifactLookups
      ? this.DevOpsAction?.ArtifactLookups[0]
      : null;

    return artLookup;
  }

  @Input('data')
  public Data: {
    Environment: EaCEnvironmentAsCode;
    EnvironmentLookup: string;
  };

  public get DefaultFileFormControl(): AbstractControl {
    return this.DevOpsFormGroup?.controls.defaultFile;
  }

  public get DevOpsAction(): EaCDevOpsAction {
    return this.Data.Environment.DevOpsActions && this.DevOpsActionLookup
      ? this.Data.Environment.DevOpsActions[this.DevOpsActionLookup] || {}
      : {};
  }

  public get DevOpsActionLookup(): string {
    if (!!this.DevOpsActionLookupFormControl?.value) {
      return this.DevOpsActionLookupFormControl.value;
    }

    if (!!this.EditingSourceControl?.DevOpsActionTriggerLookups) {
      return this.EditingSourceControl?.DevOpsActionTriggerLookups[0];
    } else {
      return null;
    }
  }

  public get DevOpsActionLookups(): Array<string> {
    return Object.keys(this.DevOpsActions || {});
  }

  public get DevOpsActionLookupFormControl(): AbstractControl {
    return this.DevOpsFormGroup.get('devOpsActionLookup');
  }

  public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
    return this.Data.Environment.DevOpsActions || {};
  }

  public get EditingSourceControl(): EaCSourceControl {
    let sc = this.Data?.Environment?.Sources
      ? this.Data?.Environment?.Sources[this.EditingSourceControlLookup]
      : null;

    if (sc == null && this.EditingSourceControlLookup) {
      sc = {};
    }

    return sc;
  }

  public EditingSourceControlLookup: string;

  public HostingDetails: ProjectHostingDetails;

  @ViewChild(HostingDetailsFormGroupComponent)
  public HostingDetailsFormControls: HostingDetailsFormGroupComponent;

  @ViewChild(SourceControlFormControlsComponent)
  public SourceControlFormControls: SourceControlFormControlsComponent;

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Data.Environment.Sources || {};
  }

  //  Constructors
  constructor(
    protected formBldr: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.EditingSourceControlLookup = null;

    this.HostingDetails = new ProjectHostingDetails();
  }

  //  Life Cycle
  public ngOnInit(): void {
    if (this.SourceControlLookups?.length <= 0) {
      this.CreateNewSourceControl();
    }
  }

  //  API Methods
  public BranchesChanged(branches: string[]): void {
    this.loadProjectHostingDetails();
  }

  public CreateNewSourceControl(): void {
    this.SetEditingSourceControl(Guid.CreateRaw());
  }

  public DeleteSourceControl(scLookup: string): void {
    if (
      confirm(`Are you sure you want to delete source control '${scLookup}'?`)
    ) {
      this.appsFlowEventsSvc.DeleteSourceControl(scLookup);
    }
  }

  public DevOpsActionLookupChanged(event: MatSelectChange): void {
    this.configureDevOpsAction();
  }

  public SaveEnvironment(): void {
    const saveEnvReq: SaveEnvironmentAsCodeEventRequest = {
      Environment: {
        ...this.Data.Environment,
        Artifacts: this.Data.Environment.Artifacts || {},
        DevOpsActions: this.Data.Environment.DevOpsActions || {},
        Secrets: this.Data.Environment.Secrets || {},
        Sources: this.Data.Environment.Sources || {},
      },
      EnvironmentLookup: this.Data.EnvironmentLookup,
      EnterpriseDataTokens: {},
    };

    let artifactLookup: string;

    let artifact: EaCArtifact = {
      ...this.Artifact,
      ...this.HostingDetailsFormControls
        .SelectedHostingOptionInputControlValues,
    };

    if (!this.ArtifactLookup) {
      artifactLookup = Guid.CreateRaw();

      artifact = {
        ...artifact,
        Type: this.HostingDetailsFormControls.SelectedHostingOption
          .ArtifactType,
        Name: this.HostingDetailsFormControls.SelectedHostingOption.Name,
        NPMRegistry: 'https://registry.npmjs.org/',
      };
    }

    saveEnvReq.Environment.Artifacts[artifactLookup] = artifact;

    let devOpsActionLookup: string;

    if (!this.DevOpsActionLookup) {
      devOpsActionLookup = Guid.CreateRaw();

      const doa: EaCDevOpsAction = {
        ...this.DevOpsAction,
        ArtifactLookups: [artifactLookup],
        Name: this.HostingDetailsFormControls.SelectedHostingOption.Name,
        Path: this.HostingDetailsFormControls.SelectedHostingOption.Path,
        Templates:
          this.HostingDetailsFormControls.SelectedHostingOption.Templates,
      };

      if (this.HostingDetailsFormControls.NPMTokenFormControl?.value) {
        const secretLookup = 'npm-access-token';

        doa.SecretLookups = [secretLookup];

        saveEnvReq.Environment.Secrets[secretLookup] = {
          Name: 'NPM Access Token',
          DataTokenLookup: secretLookup,
          KnownAs: 'NPM_TOKEN',
        };

        saveEnvReq.EnterpriseDataTokens[secretLookup] = {
          Name: saveEnvReq.Environment.Secrets[secretLookup].Name,
          Description: saveEnvReq.Environment.Secrets[secretLookup].Name,
          Value: this.HostingDetailsFormControls.NPMTokenFormControl.value,
        };
      }

      saveEnvReq.Environment.DevOpsActions[devOpsActionLookup] = doa;
    } else {
      devOpsActionLookup = this.DevOpsActionLookupFormControl.value;
    }

    let source: EaCSourceControl = {
      ...this.EditingSourceControl,
      Branches: this.SourceControlFormControls.SelectedBranches,
      MainBranch: this.SourceControlFormControls.MainBranchFormControl.value,
    };

    source = {
      ...source,
      Type: 'GitHub',
      Name: this.EditingSourceControlLookup,
      DevOpsActionTriggerLookups: [devOpsActionLookup],
      Organization:
        this.SourceControlFormControls.OrganizationFormControl.value,
      Repository: this.SourceControlFormControls.RepositoryFormControl.value,
    };

    const scLookup = `github://${source.Organization}/${source.Repository}`;

    saveEnvReq.Environment.Sources[scLookup] = source;

    this.appsFlowEventsSvc.SaveEnvironmentAsCode(saveEnvReq);
  }

  public SetEditingSourceControl(scLookup: string): void {
    this.EditingSourceControlLookup = scLookup;

    this.setupDevOpsForm();
  }

  //  Helpers
  protected configureDevOpsAction(): void {
    setTimeout(() => {
      this.DevOpsActionLookupFormControl.setValue(this.DevOpsActionLookup);

      setTimeout(() => {
        const hostOption = this.HostingDetails?.HostingOptions?.find(
          (ho) => ho.Path === this.DevOpsAction.Path
        );

        this.HostingDetailsFormControls?.BuildPipelineFormControl.setValue(
          hostOption?.Lookup
        );

        this.HostingDetailsFormControls?.BuildPipelineChanged();
      }, 0);
    }, 0);
  }

  protected loadProjectHostingDetails(): void {
    if (this.SourceControlFormControls?.SelectedBranches?.length > 0) {
      this.HostingDetails.Loading = true;

      this.appsFlowSvc
        .LoadProjectHostingDetails(
          this.SourceControlFormControls?.OrganizationFormControl?.value,
          this.SourceControlFormControls?.RepositoryFormControl?.value,
          this.SourceControlFormControls?.MainBranchFormControl?.value
        )
        .subscribe(
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

  protected setupDevOpsForm(): void {
    if (this.EditingSourceControl != null) {
      this.DevOpsFormGroup = this.formBldr.group({});

      this.setupBuildForm();
    }
  }

  protected setupBuildForm(): void {
    this.DevOpsFormGroup.addControl(
      'devOpsActionLookup',
      this.formBldr.control(this.DevOpsActionLookup || '', [])
    );
  }
}
