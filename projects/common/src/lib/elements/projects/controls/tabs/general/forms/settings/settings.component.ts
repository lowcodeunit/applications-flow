import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {// implements OnInit {
  // protected formIsDirtySubscription: Subscription;

  // /**
  //  * Card / Form Config
  //  */
  // public Config: CardFormConfigModel;

  // /**
  //  * Formgroup
  //  */
  // public Form: FormGroup;

  // /**
  //  * Name of form
  //  */
  // protected formName: string;

  // /**
  //  * Access form control for Build Command
  //  */
  // public get BuildCommand(): AbstractControl {
  //   return this.Form.get('buildCommand');
  // }

  // /**
  //  * Access form control for Build Command
  //  */
  // // public get BuildCommandOverride(): AbstractControl {
  // //   return this.Form.get('buildCommandOverride');
  // // }

  // /**
  //  * Access form control for Install Command
  //  */
  // public get InstallCommand(): AbstractControl {
  //   return this.Form.get('installCommand');
  // }

  // /**
  //  * Access form control for Build Command
  //  */
  // // public get InstallCommandOverride(): AbstractControl {
  // //   return this.Form.get('installCommandOverride');
  // // }

  // /**
  //  * Access form control for Output Directory
  //  */
  // public get OutputDirectory(): AbstractControl {
  //   return this.Form.get('outputDirectory');
  // }

  // /**
  //  * Access form control for Build Command
  //  */
  // // public get OutputDirectoryOverride(): AbstractControl {
  // //   return this.Form.get('outputDirectoryOverride');
  // // }

  // /**
  //  * Access form control for Preset
  //  */
  // public get Preset(): AbstractControl {
  //   return this.Form.get('preset');
  // }

  // /**
  //  * List of dev setting presets
  //  */
  // public FrameworkPresets: Array<DevSettingsPresetModel>;

  // /**
  //  * When form is dirty, ties into formsService.DisableForms
  //  */
  // public IsDirty: boolean;

  // /**
  //  * Selected preset
  //  */
  // public SelectedFrameworkPreset: DevSettingsPresetModel;

  // /**
  //  * Input value for state
  //  */
  // @Input('project')
  // public Project: EaCProjectAsCode;

  // constructor(
  //   protected formsService: FormsService,
  //   protected appsFlowEventsSvc: ApplicationsFlowEventsService
  // ) {
  
  // }

  // public ngOnInit(): void {
  //   this.formName = 'SettingsForm';

  //   this.setupForm();

  //   this.config();

  //   this.setupPresets();
  // }

  // /**
  //  * Slider toggle change event
  //  *
  //  * Loop over all controls and check if the toggle value is
  //  * included in the name of any of the form controls, if so
  //  * enable/disable that control.
  //  *
  //  * This only works if the naming of the toggle and the control
  //  * have the same values (buildCommand and buildCommandOverride)
  //  * In this case, toggle would have the value 'buildCommandOverride'
  //  * and the field we are looking to enable/disable is 'buildCommand.'
  //  *
  //  * TODO: find a better way to associate the toggle and the input, relying
  //  * on the name could be problematic - shannon
  //  *
  //  * @param event slider toggle event
  //  */
  // // public SliderChanged(event: MatSlideToggleChange): void {
  // //   const toggle: string = event.source.name.toLowerCase();
  // //   const checked: boolean = event.checked;

  // //   Object.keys(this.Form.controls).forEach((key: string) => {
  // //     const k: string = key.toLowerCase();
  // //     if (toggle !== k && toggle.includes(k)) {
  // //       checked
  // //         ? this.Form.controls[key].enable()
  // //         : this.Form.controls[key].disable();
  // //     }
  // //   });
  // // }

  // /**
  //  *
  //  * @param val Selected preset
  //  */
  // public PresetSelected(val: DevSettingsPresetModel): void {}

  // /**
  //  * Need this extra work to test for validity, because of setting all forms
  //  * valid. In this case, we don't want the inputs to be enabled unless the
  //  * override toggle is set to true - setting form.enable(), enables the inputs,
  //  * regarless if the toggle is false
  //  *
  //  * @param form control to test
  //  *
  //  * @returns if control is valid or not
  //  */
  // // public IsFormValid(form: AbstractControl): boolean {
  // //   return form.value.length >= 3 || form.valid;
  // // }

  // protected config(): void {
  //   this.Config = new CardFormConfigModel({
  //     Icon: 'settings',
  //     Title: 'Build & Development Settings',
  //     Subtitle:
  //       'When using a framework for a new project, it will be automatically detected. As a result, several project settings are automatically configured to achieve the best result. You can override them below.',
  //     FormActions: {
  //       Message: 'Changes will be applied to your next deployment',
  //       Actions: [
  //         {
  //           Label: 'Reset',
  //           Color: 'warn',
  //           ClickEvent: () => this.resetForm(),
  //           // use arrow function, so 'this' refers to SettingsComponent
  //           // if we used ClickeEvent: this.clearForm, then 'this' would refer to this current Actions object
  //           Type: 'RESET',
  //         },
  //         {
  //           Label: 'Save',
  //           Color: 'accent',
  //           ClickEvent: () => this.save(),
  //           Type: 'SAVE',
  //         },
  //       ],
  //     },
  //   });
  // }

  // protected setupForm(): void {
  //   const lcu = this.Project?.LCUs[0];

  //   const action = this.Project?.ActionsSet
  //     ? this.Project.ActionsSet[lcu.ID] || {}
  //     : {};

  //   const actionDetails = JSON.parse(action.Details || '{}');

  //   this.Form = new FormGroup({
  //     preset: new FormControl(''),
  //     buildCommand: new FormControl(
  //       {
  //         value: actionDetails?.BuildScript || 'npm run build',
  //         disabled: false,
  //       },
  //       {
  //         validators: [Validators.required, Validators.minLength(3)],
  //         updateOn: 'change',
  //       }
  //     ),
  //     // buildCommandOverride: new FormControl(false, { updateOn: 'change' }),
  //     outputDirectory: new FormControl(
  //       {
  //         value: actionDetails?.OutputFolder || 'build',
  //         disabled: false,
  //       },
  //       {
  //         validators: [Validators.required, Validators.minLength(3)],
  //         updateOn: 'change',
  //       }
  //     ),
  //     // outputDirectoryOverride: new FormControl(false),
  //     installCommand: new FormControl(
  //       {
  //         value: actionDetails?.InstallCommand || 'npm ci',
  //         disabled: false,
  //       },
  //       {
  //         validators: [Validators.required, Validators.minLength(3)],
  //         updateOn: 'change',
  //       }
  //     ),
  //     // installCommandOverride: new FormControl(false)
  //   });

  //   this.formsService.Form = { Id: this.formName, Form: this.Form };
  //   this.onChange();
  // }

  // protected onChange(): void {
  //   this.Form.valueChanges.subscribe((val: any) => {
  //     if (this.formsService.ForRealThough(this.formName, this.Form)) {
  //       this.IsDirty = true;
  //       // disable all forms except the current form being edited
  //       this.formsService.DisableForms(this.formName);
  //     } else {
  //       this.IsDirty = false;
  //       // enable all forms
  //       this.formsService.DisableForms(false);
  //     }
  //   });
  // }

  // /**
  //  * Preset values
  //  */
  // protected setupPresets(): void {
  //   this.FrameworkPresets = [
  //     {
  //       Icon: 'face',
  //       ID: 1,
  //       Label: 'Option 1',
  //     },
  //     {
  //       Icon: 'house',
  //       ID: 2,
  //       Label: 'Option 2',
  //     },
  //   ];
  // }

  // /**
  //  * Reset form controls back to previous values
  //  */
  // protected resetForm(): void {
  //   // enable all forms
  //   // this.formsService.DisableForms(false);

  //   this.formsService.ResetFormValues(this.formName);
  // }

  // /**
  //  * Save changes
  //  */
  // protected save(): void {
  //   const lcu = this.Project.LCUs[0];

  //   const action = this.Project.ActionsSet[lcu.ID] || {};

  //   action.Details = JSON.stringify({
  //     BuildScript: this.BuildCommand.value,
  //     OutputFolder: this.OutputDirectory.value,
  //     InstallCommand: this.InstallCommand.value || 'npm ci',
  //   });

  //   this.appsFlowEventsSvc.SaveProject({
  //     ...this.Project,
  //   });

  //   this.formsService.UpdateValuesReference({
  //     Id: this.formName,
  //     Form: this.Form,
  //   });
  // }
}
