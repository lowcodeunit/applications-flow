import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LcuElementComponent, LCUElementContext } from '@lcu/common';
import { FormActionsModel } from './../../../../../models/form-actions.model';
import { ApplicationsFlowState } from './../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from './../../../../../services/applications-flow.service';

export class ApplicationsFlowProjectsElementState {}

export class ApplicationsFlowProjectsContext extends LCUElementContext<ApplicationsFlowProjectsElementState> {}

@Component({
  selector: 'lcu-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})

export class GeneralComponent
extends LcuElementComponent<ApplicationsFlowProjectsContext>
  implements OnDestroy, OnInit, AfterContentChecked  {

  // public BuildDevIcon: string;
  // public BuildDevTitle: string;
  public BuildDevSubTitle: string;
  // public ProjectNameIcon: string;
  // public ProjectNameTitle: string;

  /**
   * FormGroup for dev settings card
   */
  public DevSettingsFormGroup: FormGroup;

  /**
   * Main FormGroup
   */
  public GeneralForm: FormGroup;


  /**
   * Access form control for project name
   */
   public get ProjectName(): AbstractControl {
    return this.GeneralForm.get('ProjectNameFormGroup.projectName');
  }

  /**
   * Access form control for project surname
   */
  public get ProjectSurname(): AbstractControl {
    return this.GeneralForm.get('ProjectNameFormGroup.projectSurname');
  }

  public ProjNameActions: FormActionsModel;

  public ProjectNameSubTitle: string;

  /**
   * FormGroup for project name card
   */
  public ProjectNameFormGroup: FormGroup;

  // public RootDirIcon: string;
  // public RootDirTitle: string;

  /**
   * FormGroup for root dir card
   */
  public RootDirFormGroup: FormGroup;
  public RootDirSubTitle: string;


  public State: ApplicationsFlowState;

  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected cd: ChangeDetectorRef
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();

    // setTimeout(() => {
    this.setupForm();
    this.setupProjectName();
    this.setupRootDirectory();
    this.setupBuildDev();
// }, 0);

  }

  //  Life Cycle
  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {
    // super.ngOnInit();
  }

  public ngAfterContentChecked(): void {
    this.cd.detectChanges();
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

   this.ProjNameActions =
     {
       Message: 'Changes will be applied to your next deployment',
       Actions:
       [
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
      ]
     }
    ;
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
    this.GeneralForm = new FormGroup({
      ProjectNameFormGroup: new FormGroup({
        projectName: new FormControl('', {
          validators: [Validators.required],
          updateOn: 'change'
        }),
        projectSurname: new FormControl('', {validators: Validators.required})
      }),
      RootDirFormGroup: new FormGroup({
        root: new FormControl(''),
        includeSource: new FormControl('')
      }),
      DevSettingsFormGroup: new FormGroup({
        preset: new FormControl(''),
        buildCommand: new FormControl(''),
        outputDirectory: new FormControl(''),
        devCommand: new FormControl('')
      })
    });

    this.onChanges();
  }

  protected onChanges(): void {
    this.GeneralForm.valueChanges.subscribe((val: any) => {

    });
  }

}
