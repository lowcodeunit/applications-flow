import { FormsService } from './../../../../../../../services/forms.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DevSettingsPresetModel } from './../../../../../../../models/dev-settings-preset.model';
import { CardFormConfigModel } from './../../../../../../../models/card-form-config.model';
import { ProjectState } from './../../../../../../../state/applications-flow.state';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationsFlowEventsService } from '../../../../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  protected formIsDirtySubscription: Subscription;

  /**
   * Card / Form Config
   */
  public Config: CardFormConfigModel;

  /**
   * Formgroup
   */
  public Form: FormGroup;

  /**
   * Access form control for Build Command
   */
  public get BuildCommand(): AbstractControl {
    return this.Form.get('buildCommand');
  }

  /**
   * Access form control for Build Command
   */
  public get BuildCommandOverride(): AbstractControl {
    return this.Form.get('buildCommandOverride');
  }

  /**
   * Access form control for Install Command
   */
  public get InstallCommand(): AbstractControl {
    return this.Form.get('installCommand');
  }

  /**
   * Access form control for Build Command
   */
  public get InstallCommandOverride(): AbstractControl {
    return this.Form.get('installCommandOverride');
  }

  /**
   * Access form control for Output Directory
   */
  public get OutputDirectory(): AbstractControl {
    return this.Form.get('outputDirectory');
  }

  /**
   * Access form control for Build Command
   */
  public get OutputDirectoryOverride(): AbstractControl {
    return this.Form.get('outputDirectoryOverride');
  }

  /**
   * Access form control for Preset
   */
  public get Preset(): AbstractControl {
    return this.Form.get('preset');
  }

  /**
   * List of dev setting presets
   */
  public FrameworkPresets: Array<DevSettingsPresetModel>;

  /**
   * Selected preset
   */
  public SelectedFrameworkPreset: DevSettingsPresetModel;

  /**
   * Input value for state
   */
  @Input('project')
  public Project: ProjectState;

  constructor(protected formsService: FormsService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  public ngOnInit(): void {
    this.setupForm();

    this.config();

    this.setupPresets();

    // this.formIsDirtySubscription = this.formsService.FormIsDirty.subscribe(
    //   (val: {IsDirty: boolean, Id: string, Form: FormGroup}) => {

    //   if (val.Id !== 'SettingsForm' && this.Form.enabled) {
    //     console.log('DISABLE SETTINGS');
    //     // val.IsDirty ? this.Form.disable() : this.Form.enable();
    //     this.Form.disable();
    //    }
    // });
  }

  /**
   * Slider toggle change event
   *
   * Loop over all controls and check if the toggle value is
   * included in the name of any of the form controls, if so
   * enable/disable that control.
   *
   * This only works if the naming of the toggle and the control
   * have the same values (buildCommand and buildCommandOverride)
   * In this case, toggle would have the value 'buildCommandOverride'
   * and the field we are looking to enable/disable is 'buildCommand.'
   *
   * TODO: find a better way to associate the toggle and the input, relying
   * on the name could be problematic - shannon
   *
   * @param event slider toggle event
   */
  public SliderChanged(event: MatSlideToggleChange): void {
    const toggle: string = event.source.name.toLowerCase();
    const checked: boolean = event.checked;

    Object.keys(this.Form.controls).forEach((key: string) => {
      const k: string = key.toLowerCase();
      if (toggle !== k && toggle.includes(k)) {
        checked
          ? this.Form.controls[key].enable()
          : this.Form.controls[key].disable();
      }
    });
  }

  /**
   *
   * @param val Selected preset
   */
  public PresetSelected(val: DevSettingsPresetModel): void {}

  protected config(): void {
    this.Config = new CardFormConfigModel({
      Icon: 'settings',
      Title: 'Build & Development Settings',
      Subtitle:
        'When using a framework for a new project, it will be automatically detected. As a s result, several project settings are automatically configured t achieve the best result. You can override them below.',
      FormActions: {
        Message: 'Changes will be applied to your next deployment',
        Actions: [
          {
            Label: 'Clear',
            Color: 'warn',
            ClickEvent: () => this.clearForm(),
            // use arrow function, so 'this' refers to ProjectNameComponent
            // if we used ClickeEvent: this.clearForm, then 'this' would refer to this current Actions object
            Type: 'RESET',
          },
          {
            Label: 'Save',
            Color: 'accent',
            ClickEvent: () => this.save(),
            Type: 'SAVE',
          },
        ],
      },
    });
  }

  /**
   * Setup form controls
   */
  protected setupForm(): void {
    this.Form = new FormGroup({
      preset: new FormControl(''),
      buildCommand: new FormControl(
        {
          value: 'npm run build',
          disabled: true,
        },
        {
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change',
        }
      ),
      buildCommandOverride: new FormControl(false, { updateOn: 'change' }),
      outputDirectory: new FormControl(
        {
          value: 'build',
          disabled: true,
        },
        {
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change',
        }
      ),
      outputDirectoryOverride: new FormControl(false),
      installCommand: new FormControl(
        {
          value: 'npm ci',
          disabled: true,
        },
        {
          validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change',
        }
      ),
      installCommandOverride: new FormControl(false)
    });

    this.formsService.Form = { Id: 'SettingsForm', Form: this.Form };
    this.onChange();
  }

  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: any) => {
      // disable all forms except the current form being edited
      this.formsService.DisableForms('SettingsForm');
    });
  }

  /**
   * Preset values
   */
  protected setupPresets(): void {
    this.FrameworkPresets = [
      {
        Icon: 'face',
        ID: 1,
        Label: 'Option 1',
      },
      {
        Icon: 'house',
        ID: 2,
        Label: 'Option 2',
      },
    ];
  }

  /**
   * Clear form controls
   */
  protected clearForm(): void {
    // this.Form.reset();

    // enable all forms
    this.formsService.DisableForms(false);
  }

  /**
   * Save changes
   */
  protected save(): void {
    this.appsFlowEventsSvc.SaveProject({
      ...this.Project,
      // BuildCommand: this.BuildCommand.value,
      // InstallCommand: this.InstallCommand.value,
      // OutputDirectory: this.OutputDirectory.value
    });
  }
}
