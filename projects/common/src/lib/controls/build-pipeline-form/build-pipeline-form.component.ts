import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseModeledResponse } from '@lcu/common';
import { EaCArtifact, EaCDevOpsAction, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { ProjectHostingDetails } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-build-pipeline-form',
  templateUrl: './build-pipeline-form.component.html',
  styleUrls: ['./build-pipeline-form.component.scss']
})
export class BuildPipelineFormComponent implements OnInit {


//PROPERTIES

public get Artifact(): EaCArtifact {
  return this.Environment?.Artifacts && this.ArtifactLookup
    ? this.Environment?.Artifacts[this.ArtifactLookup] || {}
    : {};
}

public get ArtifactLookup(): string {
  const artLookup = this.DevOpsAction?.ArtifactLookups
    ? this.DevOpsAction?.ArtifactLookups[0]
    : null;

  return artLookup;
}



public get DevOpsAction(): EaCDevOpsAction {
  return this.Environment.DevOpsActions && this.DevOpsActionLookup
    ? this.Environment.DevOpsActions[this.DevOpsActionLookup] || {}
    : {};
}

@Input('devops-action-lookup')
public DevOpsActionLookup: string;

public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
  return this.Environment.DevOpsActions || {};
}



public DevOpsFormGroup: FormGroup;

public get EditingSourceControl(): EaCSourceControl {
    let sc = this.Environment?.Sources
      ? this.Environment?.Sources[this.EditingSourceControlLookup]
      : null;

    if (sc == null && this.EditingSourceControlLookup) {
      sc = {};
    }

    return sc;
  }

  @Input('environment')
  public Environment: EaCEnvironmentAsCode;

  public EditingSourceControlLookup: string;

  public HostingDetails: ProjectHostingDetails;

  @Input('main-branch')
  public MainBranch: string;

  @Input('organization')
  public Organization: string;

  @Input('repository')
  public Repository: string;

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment.Sources || {};
  }

  constructor(protected formBldr: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService) {
    this.HostingDetails = new ProjectHostingDetails();
   }

  public ngOnInit(): void {
    
  }

//API METHODS
  
//HELPERS
protected loadProjectHostingDetails(): void {
    this.HostingDetails.Loading = true;

    this.appsFlowSvc
      .LoadProjectHostingDetails(
        this.Organization,
        this.Repository,
        this.MainBranch
      )
      .subscribe(
        (response: BaseModeledResponse<ProjectHostingDetails>) => {
          this.HostingDetails = response.Model;

          this.HostingDetails.Loading = false;

        },
        (err) => {
          this.HostingDetails.Loading = false;
        }
      );
  
}
 

}
