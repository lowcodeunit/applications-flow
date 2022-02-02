import { Component, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseModeledResponse } from '@lcu/common';
import { EaCArtifact, EaCDevOpsAction, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { ProjectHostingDetails, ProjectHostingOption } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-build-pipeline-form',
  templateUrl: './build-pipeline-form.component.html',
  styleUrls: ['./build-pipeline-form.component.scss']
})
export class BuildPipelineFormComponent implements OnInit {


//PROPERTIES

@Input('build-pipeline')
public BuildPipeline: string;

// @Input('details')
// public Details: ProjectHostingDetails;

@Input('devops-action-lookup')
public DevOpsActionLookup: string;

@Input('disabled')
public Disabled: boolean;

@Input('environment')
public Environment: EaCEnvironmentAsCode;

 // @Input('main-branch')
  // public MainBranch: string;

  // @Input('organization')
  // public Organization: string;

  // @Input('repository')
  // public Repository: string;


public get Artifact(): EaCArtifact {
  console.log("ARTIFACT: ", this.Environment?.Artifacts[this.ArtifactLookup]);
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

  public get BuildPipelineFormControl(): AbstractControl {
    
    return this.BuildPipelineFormGroup?.controls.buildPipeline;
  }



public get DevOpsAction(): EaCDevOpsAction {
  return this.Environment.DevOpsActions && this.DevOpsActionLookup
    ? this.Environment.DevOpsActions[this.DevOpsActionLookup] || {}
    : {};
}



public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
  return this.Environment.DevOpsActions || {};
}



public BuildPipelineFormGroup: FormGroup;

public get EditingSourceControl(): EaCSourceControl {
    let sc = this.Environment?.Sources
      ? this.Environment?.Sources[this.EditingSourceControlLookup]
      : null;

    if (sc == null && this.EditingSourceControlLookup) {
      sc = {};
    }

    return sc;
  }

 

  public EditingSourceControlLookup: string;

  public HostingDetails: ProjectHostingDetails;

 
// (ho) => ho.Lookup === this.BuildPipeline
  public get SelectedHostingOption(): ProjectHostingOption {
    return this.HostingDetails?.HostingOptions?.find(
      (ho) => ho.Lookup === this.BuildPipeline
    );
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment.Sources || {};
  }

  constructor(protected formBuilder: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService) {
    this.HostingDetails = new ProjectHostingDetails();
   }

  public ngOnInit(): void {

    this.BuildPipelineFormGroup = this.formBuilder.group({});

    this.loadProjectHostingDetails();

    console.log("ARTIFACT: ", this.Artifact);
    // this.BuildPipeline ||
    // github-artifacts-release is  this.HostingDetails?.HostingOptions[0]?.Lookup
    this.BuildPipeline =
      this.HostingDetails?.HostingOptions
        ? this.HostingDetails?.HostingOptions[0]?.Lookup
        : '';
      console.log("Build Pipeline HERE= ", this.BuildPipeline);

    if (this.BuildPipelineFormGroup != null) {
      this.BuildPipelineFormGroup.removeControl('hostingDetails');
    }

    this.BuildPipelineFormGroup.addControl(
      'hostingDetails',
      this.formBuilder.group({
        buildPipeline: [this.BuildPipeline, [Validators.required]],
      })
    );

    this.setupControlsForForm();
    
  }

//API METHODS

public BuildPipelineChanged(): void {
  console.log("build pipeline value: ",this.BuildPipelineFormControl?.value)
  this.BuildPipeline = this.BuildPipelineFormControl?.value;

  this.setupControlsForForm();
}
  
//  Helpers
protected setupControlsForForm(): void {
  //for (const ctrlName in this.BuildPipelineFormGroup.controls) {
//devOpsAction doesn't exist
//removes hosting details
    // if (ctrlName !== 'buildPipeline' && ctrlName !== 'devOpsAction') {
    //   console.log("removing control: ", ctrlName)
    //   this.BuildPipelineFormGroup.removeControl(ctrlName);
    // }
  //}

  this.BuildPipelineFormGroup.addControl(
    'devOpsActionName',
    this.formBuilder.control(
      this.DevOpsAction?.Name || this.SelectedHostingOption?.Name || '',
      [Validators.required]
    )
  );

  this.SelectedHostingOption?.Inputs?.forEach((input) => {
    const validators = input.Required ? [Validators.required] : [];

    this.BuildPipelineFormGroup.addControl(
      input.Lookup,
      this.formBuilder.control(
        this.Artifact[input.Lookup] || input.DefaultValue || '',
        validators
      )
    );

    // if (this.Disabled) {
    //   this.FormGroup.controls[input.Lookup].disable();
    // }
  });
debugger;
  if (this.BuildPipelineFormControl?.value === 'npm-release') {
debugger;
    if (!this.BuildPipelineFormGroup.controls.npmToken) {
      this.BuildPipelineFormGroup.addControl(
        'npmToken',
        this.formBuilder.control(
          '',
          this.Disabled ? [] : [Validators.required]
        )
      );

      if (this.Disabled) {
        this.BuildPipelineFormGroup.controls.npmToken.disable();
      }
    }
  } else if (
    this.BuildPipelineFormControl?.value === 'github-artifacts-release'
  ) {
    if (this.BuildPipelineFormGroup.controls.npmToken) {
      this.BuildPipelineFormGroup.removeControl('npmToken');
    }
  }
}


protected loadProjectHostingDetails(): void {
    // this.HostingDetails.Loading = true;
    // this.Organization,
    // this.Repository,
    // this.MainBranch

    //     "powhound4",
    //     "RedwoodCrystals",
    //     "master"

    this.appsFlowSvc
      .NewLoadProjectHostingDetails()
      .subscribe(
        (response: BaseModeledResponse<ProjectHostingDetails>) => {
          this.HostingDetails = response.Model;
          console.log("response: ", response);
          this.HostingDetails.Loading = false;

        },
        (err) => {
          this.HostingDetails.Loading = false;
          console.log("hosting details LOADING EERR: ", this.HostingDetails);
          console.log("ERR: ", err);

        }
      );
      console.log("HOSTING DETAILS: ", this.HostingDetails);
  
}
 

}
