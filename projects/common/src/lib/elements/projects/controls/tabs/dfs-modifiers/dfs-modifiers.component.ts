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
  SaveDFSModifierEventRequest,
} from '../../../../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCArtifact,
  EaCDevOpsAction,
  EaCDFSModifier,
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
  selector: 'lcu-dfs-modifiers',
  templateUrl: './dfs-modifiers.component.html',
  styleUrls: ['./dfs-modifiers.component.scss'],
})
export class DFSModifiersComponent implements OnInit {
  //  Fields

  //  Properties
  public CurrentType: string;

  @Input('data')
  public Data: {
    Modifiers: { [lookup: string]: EaCDFSModifier };
    ProjectLookup: string;
  };

  public get DetailsFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.details;
  }

  public get EditingModifier(): EaCDFSModifier {
    let mdfr = this.Modifiers
      ? this.Modifiers[this.EditingModifierLookup]
      : null;

    if (mdfr == null && this.EditingModifierLookup) {
      mdfr = {};
    }

    return mdfr;
  }

  public EditingModifierLookup: string;

  public get EnabledFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.enabled;
  }

  public get LocationFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.location;
  }

  public ModifierFormGroup: FormGroup;

  public get ModifierLookups(): Array<string> {
    return Object.keys(this.Modifiers || {});
  }

  public get Modifiers(): { [lookup: string]: EaCDFSModifier } {
    return this.Data.Modifiers || {};
  }

  public get NameFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.name;
  }

  public get PathFilterFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.pathFilter;
  }

  public get PriorityFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.priority;
  }

  public get ScriptFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.script;
  }

  public get ScriptIDFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.scriptId;
  }

  public get StateDataTokenFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.stateDataToken;
  }

  public get TypeFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.modifierType;
  }

  //  Constructors
  constructor(
    protected formBldr: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.EditingModifierLookup = null;
  }

  //  Life Cycle
  public ngOnInit(): void {
    if (this.ModifierLookups?.length <= 0) {
      this.CreateNewModifier();
    }
  }

  //  API Methods
  public CreateNewModifier(): void {
    this.SetEditingModifier(Guid.CreateRaw());
  }

  public DeleteModifier(modifierLookup: string, modifierName: string): void {
    if (
      confirm(`Are you sure you want to delete modifier '${modifierName}'?`)
    ) {
      this.appsFlowEventsSvc.DeleteSourceControl(modifierLookup);
    }
  }

  public SaveModifier(): void {
    const saveMdfrReq: SaveDFSModifierEventRequest = {
      Modifier: {
        ...this.EditingModifier,
        Name: this.NameFormControl.value,
        Enabled: this.EnabledFormControl.value,
        PathFilterRegex: this.PathFilterFormControl.value,
        Priority: this.PriorityFormControl.value,
        Type: this.CurrentType,
        Details: {},
      },
      ModifierLookup: this.EditingModifierLookup,
      ProjectLookup: this.Data.ProjectLookup
    };

    switch (this.CurrentType) {
      case 'LCU.Runtime.Applications.Modifiers.HTMLBaseDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        break;

      case 'LCU.Runtime.Applications.Modifiers.LCURegDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        saveMdfrReq.Modifier.Details['StateDataToken'] = this.StateDataTokenFormControl.value;
        break;

      case 'LCU.Runtime.Applications.Modifiers.ThirdPartyLibraryDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        saveMdfrReq.Modifier.Details['Location'] = this.LocationFormControl.value;

        saveMdfrReq.Modifier.Details['Script'] = this.ScriptFormControl.value;

        saveMdfrReq.Modifier.Details['ScriptID'] = this.ScriptIDFormControl.value;
        break;
    }

    this.appsFlowEventsSvc.SaveDFSModifier(saveMdfrReq);
  }

  public SetEditingModifier(modifierLookup: string): void {
    this.EditingModifierLookup = modifierLookup;

    this.setupModifierForm();
  }

  public TypeChanged(event: MatSelectChange): void {
    this.CurrentType = event.value;

    this.setupTypeForm();
  }

  //  Helpers
  protected setupModifierForm(): void {
    if (this.EditingModifier != null) {
      this.ModifierFormGroup = this.formBldr.group({
        name: [this.EditingModifier?.Name, Validators.required],
        type: [this.EditingModifier?.Type, Validators.required],
        priority: [this.EditingModifier?.Priority, Validators.required],
        enabled: [this.EditingModifier?.Enabled, Validators.required],
        pathFilter: [
          this.EditingModifier?.PathFilterRegex,
          Validators.required,
        ],
      });

      this.setupTypeForm();
    }
  }

  protected setupTypeForm(): void {
    this.ModifierFormGroup.removeControl('stateDataToken');

    this.ModifierFormGroup.removeControl('location');
    this.ModifierFormGroup.removeControl('script');
    this.ModifierFormGroup.removeControl('scriptId');

    switch (this.CurrentType) {
      case 'LCU.Runtime.Applications.Modifiers.HTMLBaseDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        break;

      case 'LCU.Runtime.Applications.Modifiers.LCURegDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        this.ModifierFormGroup.addControl(
          'stateDataToken',
          this.formBldr.control(
            this.EditingModifier?.Details?.StateDataToken || '',
            []
          )
        );
        break;

      case 'LCU.Runtime.Applications.Modifiers.ThirdPartyLibraryDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        this.ModifierFormGroup.addControl(
          'location',
          this.formBldr.control(
            this.EditingModifier?.Details?.Location || '',
            []
          )
        );

        this.ModifierFormGroup.addControl(
          'script',
          this.formBldr.control(this.EditingModifier?.Details?.Script || '', [])
        );

        this.ModifierFormGroup.addControl(
          'scriptId',
          this.formBldr.control(
            this.EditingModifier?.Details?.ScriptID || '',
            []
          )
        );
        break;
    }
  }
}
