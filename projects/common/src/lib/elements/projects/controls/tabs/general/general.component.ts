import { DevSettingsPresetModel } from './../../../../../models/dev-settings-preset.model';
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

  public BuildDevActions: FormActionsModel;

  // public BuildDevIcon: string;
  // public BuildDevTitle: string;
  public BuildDevSubTitle: string;
  // public ProjectNameIcon: string;
  // public ProjectNameTitle: string;

  public DevSettingsActions: FormActionsModel;

  /**
   * Access form control for Build Command
   */
  public get DevSettingsBuildCommand(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.buildCommand');
  }

  /**
   * Access form control for Build Command
   */
   public get DevSettingsBuildCommandOverride(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.buildCommandOverride');
  }

  /**
   * Access form control for Dev Command
   */
   public get DevSettingsDevCommand(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.devCommand');
  }

  /**
   * Access form control for Build Command
   */
   public get DevSettingsDevCommandOverride(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.devCommandOverride');
  }

  /**
   * Access form control for Install Command
   */
   public get DevSettingsInstallCommand(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.installCommand');
  }

  /**
   * Access form control for Build Command
   */
   public get DevSettingsInstallCommandOverride(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.installCommandOverride');
  }

  /**
   * Access form control for Output Directory
   */
   public get DevSettingsOutputDirectory(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.outputDirectory');
  }

  /**
   * Access form control for Build Command
   */
   public get DevSettingsOutputDirectoryOverride(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.outputDirectoryOverride');
  }

  /**
   * Access form control for Preset
   */
   public get DevSettingsPreset(): AbstractControl {
    return this.GeneralForm.get('DevSettingsFormGroup.preset');
  }

  /**
   * FormGroup for dev settings card
   */
  public DevSettingsFormGroup: FormGroup;

  /**
   * List of dev setting presets
   */
  public FrameworkPresets: Array<DevSettingsPresetModel>;

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
   * Access form control for root directory
   */
  public get RootDirectory(): AbstractControl {
    return this.GeneralForm.get('RootDirFormGroup.rootDirectory');
  }

  /**
   * Access form control for root directory
   */
   public get RootDirectoryIncludeSource(): AbstractControl {
    return this.GeneralForm.get('RootDirFormGroup.rootDirectoryIncludeSource');
  }

  public RootDirActions: FormActionsModel;

  /**
   * FormGroup for root dir card
   */
  public RootDirFormGroup: FormGroup;
  public RootDirSubTitle: string;

  public SelectedFrameworkPreset: DevSettingsPresetModel;

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

  /**
   * 
   * @param val Selected preset
   */
  public PresetSelected(val: DevSettingsPresetModel): void {

  }

  protected setupRootDirectory(): void {
    // this.RootDirIcon = 'face';
    // this.RootDirTitle = 'Project Name';

    this.RootDirActions =
    {
      Message: 'Changes will be applied to your next deployment',
      Actions:
      [
       {
         Label: 'Clear',
         Color: 'warn',
         ClickEvent: this.clearForm
       },
       {
         Label: 'Save',
         Color: 'accent',
         ClickEvent: this.saveChanges
       }
     ]
    }
   ;

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
          ClickEvent: this.clearForm
        },
        {
          Label: 'Save',
          Color: 'accent',
          ClickEvent: this.saveChanges
        }
      ]
     }
    ;
  }

  protected saveChanges(): void {
    console.log('dynamic click event');
  }

  protected clearForm(): void {
    console.log('dynamic clear event');
  }

  protected setupBuildDev(): void {

    // this.BuildDevIcon = 'house';
    // this.BuildDevTitle = 'Build & Development Settings';

    this.BuildDevActions =
    {
      Message: 'Changes will be applied to your next deployment',
      Actions:
      [
       {
         Label: 'Clear',
         Color: 'warn',
         ClickEvent: this.clearForm
       },
       {
         Label: 'Save',
         Color: 'accent',
         ClickEvent: this.saveChanges
       }
     ]
    }

    this.FrameworkPresets = [
      {
        Icon: 'face',
        ID: 1,
        Label: 'Option 1'
      },
      {
        Icon: 'house',
        ID: 2,
        Label: 'Option 2'
      }
    ];

    this.BuildDevSubTitle = 'When using a framework for a new project, it will be automatically detected. As a s result, several project settings are automatically configured t achieve the best result. You can override them below.';
  }

  protected setupForm(): void {
    this.GeneralForm = new FormGroup({
      ProjectNameFormGroup: new FormGroup({
        projectName: new FormControl('', {
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'
        }),
        projectSurname: new FormControl('', {validators: Validators.required})
      }),
      RootDirFormGroup: new FormGroup({
        rootDirectory: new FormControl('', {
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'
        }),
        rootDirectoryIncludeSource: new FormControl(false)
      }),
      DevSettingsFormGroup: new FormGroup({
        preset: new FormControl(''),
        buildCommand: new FormControl('', { 
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'}),
        buildCommandOverride: new FormControl(false),
        outputDirectory: new FormControl('', { 
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'}),
        outputDirectoryOverride: new FormControl(false),
        installCommand: new FormControl('', { 
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'}),
        installCommandOverride: new FormControl(false),
        devCommand: new FormControl('', { 
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'}),
        devCommandOverride: new FormControl(false),
      })
    });

    this.onChanges();
  }

  protected onChanges(): void {
    this.GeneralForm.valueChanges.subscribe((val: any) => {

    });
  }

}
