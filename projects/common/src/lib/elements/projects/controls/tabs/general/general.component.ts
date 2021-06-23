import { FormCardActionsModel } from '../../../../../models/form-card-actions.model';
import { ApplicationsFlowState } from './../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from './../../../../../services/applications-flow.service';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { LcuElementComponent, LCUElementContext } from '@lcu/common';

export class ApplicationsFlowProjectsElementState {}

export class ApplicationsFlowProjectsContext extends LCUElementContext<ApplicationsFlowProjectsElementState> {}

@Component({
  selector: 'lcu-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})

export class GeneralComponent 
extends LcuElementComponent<ApplicationsFlowProjectsContext>
  implements OnDestroy, OnInit {

  // public BuildDevIcon: string;
  // public BuildDevTitle: string;
  public BuildDevSubTitle: string;
  // public ProjectNameIcon: string;
  // public ProjectNameTitle: string;

  /**
   * Form
   */
     public Form: FormGroup;

  /**
   * Access form control
   */
//  public get Primary(): AbstractControl {
//   return this.Form.get('primary');
// }

public ProjNameActions: Array<FormCardActionsModel>;

  public ProjectNameSubTitle: string;
  // public RootDirIcon: string;
  // public RootDirTitle: string;
  public RootDirSubTitle: string;

  public State: ApplicationsFlowState;

  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
  ) {
    super(injector);
    
    this.State = new ApplicationsFlowState();

  }

  //  Life Cycle
  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {
    // super.ngOnInit();

    this.setupForm();
    this.setupProjectName();
    this.setupRootDirectory();
    this.setupBuildDev();
  }

  protected setupRootDirectory(): void {
    // this.RootDirIcon = 'face';
    // this.RootDirTitle = 'Project Name';
    this.RootDirSubTitle = 'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory';
  }

  protected setupProjectName(): void {

    // this.ProjectNameIcon = 'house';
    // this.ProjectNameTitle = 'Root Directory';
    this.ProjectNameSubTitle = 'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory';

    this.ProjNameActions = [
      {
        Label: 'Clear',
        Color: 'warn',
        ClickEvent: this.clearProjNameForm
      },
      {
        Label: 'Save',
        Color: 'accent',
        ClickEvent: this.saveProjNameChanges
      }
    ];
  }

  protected saveProjNameChanges(): void {
    console.log('dynamic click event');
  }

  protected clearProjNameForm(): void {
    console.log('dynamic clear event');
  }

  protected setupBuildDev(): void {

    // this.BuildDevIcon = 'house';
    // this.BuildDevTitle = 'Build & Development Settings';
    this.BuildDevSubTitle = 'When using a framework for a new project, it will be automatically detected. As a s result, several project settings are automatically configured t achieve the best result. You can override them below.';
  }

  protected setupForm(): void {
    this.Form = new FormGroup({
      // projectNameFormGroup: new FormGroup({
      //   root: new FormControl(''),
      //   subdirectory: new FormControl('')
      // }),
      // RootDirFormGroup: new FormGroup({
      //   root: new FormControl(''),
      //   includeSource: new FormControl('')
      // }),
      // devSettingsFormGroup: new FormGroup({
      //   preset: new FormControl(''),
      //   buildCommand: new FormControl(''),
      //   outputDirectory: new FormControl(''),
      //   devCommand: new FormControl('')
      // })
    });

    this.onChanges();
  }

  protected onChanges(): void {
    this.Form.valueChanges.subscribe((val: any) => {

    });
  }

}
