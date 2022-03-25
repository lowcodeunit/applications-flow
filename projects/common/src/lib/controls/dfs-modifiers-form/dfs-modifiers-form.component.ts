
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {
  EaCDFSModifier,
  EaCProjectAsCode,
} from '@semanticjs/common';
import { Guid } from '@lcu/common';
import { MatSelectChange } from '@angular/material/select';
import { EaCService, SaveDFSModifierEventRequest } from '../../services/eac.service';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-dfs-modifier-form',
  templateUrl: './dfs-modifiers-form.component.html',
  styleUrls: ['./dfs-modifiers-form.component.scss'],
})
export class DFSModifiersFormComponent implements OnInit {
  //  Fields

  //  Properties
  public CurrentType: string;

  // @Input('data')
  // public Data: {
  //   Modifiers: { [lookup: string]: EaCDFSModifier };
  //   Project: EaCProjectAsCode;
  //   ProjectLookup: string;
  // };

  @Input('editing-modifier-lookup')
  public EditingModifierLookup: string;

  /**Specific Modifiers for either the project or appliaction */

  // @Input('modifiers')
  // public Modifiers:  { [lookup: string]: EaCDFSModifier };

  @Input('application-lookup')
    public ApplicationLookup: string;

  @Input('project')
  public Project: EaCProjectAsCode;

  @Input('project-lookup')
  public ProjectLookup: string;

  /**which level is the dfs modifier being edited ent project or app */
  @Input('level')
  public Level: string;

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

  // public EditingModifierLookup: string;

  public get EnabledFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.enabled;
  }


  public get EnterprisesModifierLookups(): Array<string> {
    return Object.keys(this.Modifiers || {});
  }

  public get LocationFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.location;
  }

  public get Modifiers(): { [lookup: string]: EaCDFSModifier } {
    return this.State?.EaC?.Modifiers;
  }


  public get ModifierLookups(): Array<string> {
    if(this.ProjectLookup){
      return this.State?.EaC?.Projects[this.ProjectLookup]?.ModifierLookups;
    }
    else if(this.ApplicationLookup){
      return this.State.EaC?.Applications[this.ApplicationLookup]?.ModifierLookups;
    }
    else{
      return Object.keys(this.Modifiers || {});
    }
  }

  public get MultiSelectFormControl(): AbstractControl {
    return this.ModifierSelectFormGroup?.controls.multiSelect;
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

  // public get Project(): EaCProjectAsCode {
  //   return this.Data.Project || {};
  // }

  public get ScriptFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.script;
  }

  public get ScriptIDFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.scriptId;
  }

  public get StateDataTokenFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.stateDataToken;
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public get TypeFormControl(): AbstractControl {
    return this.ModifierFormGroup?.controls.type;
  }

  public ModifierFormGroup: FormGroup;

  public ModifierSelectFormGroup: FormGroup;

  //  Constructors
  constructor(
    protected formBldr: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService,
    protected eacSvc: EaCService
  ) {
    // this.EditingModifierLookup = null;
  }

  //  Life Cycle
  public ngOnInit(): void {

    if(this.Level === "enterprise" && !this.EditingModifierLookup){
      this.CreateNewModifier();
    }
    
    else if(this.EditingModifierLookup){
      this.setupModifierForm();
    }

    else{
      this.setupModifierSelectForm();
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
      this.eacSvc.DeleteSourceControl(modifierLookup);
    }
  }

  public SaveModifierForAllProjects(projectLookups: Array<string>){
    const saveMdfrReq: SaveDFSModifierEventRequest = {
      Modifier: {
        ...this.EditingModifier,
        Name: this.NameFormControl.value,
        Enabled: this.EnabledFormControl.value,
        PathFilterRegex: this.PathFilterFormControl.value,
        Priority: this.PriorityFormControl.value,
        Type: this.CurrentType,
      },
      ModifierLookups: [this.EditingModifierLookup],
      ProjectLookups: projectLookups,
    };

    let details = this.getDetails();

    saveMdfrReq.Modifier.Details = JSON.stringify(details);

    this.eacSvc.SaveDFSModifier(saveMdfrReq);
  }

  public SaveModifierForApplication(applicationLookup: string): void{
    if(this.ModifierFormGroup){
    const saveMdfrReq: SaveDFSModifierEventRequest = {
      Modifier: {
        ...this.EditingModifier,
        Name: this.NameFormControl.value,
        Enabled: this.EnabledFormControl.value,
        PathFilterRegex: this.PathFilterFormControl.value,
        Priority: this.PriorityFormControl.value,
        Type: this.CurrentType,
      },
      ModifierLookups: [this.EditingModifierLookup],
      ApplicationLookup: applicationLookup,
    };

    let details = this.getDetails();

    saveMdfrReq.Modifier.Details = JSON.stringify(details);

    this.eacSvc.SaveDFSModifier(saveMdfrReq);
  }
  else if(this.ModifierSelectFormGroup){
    const saveMdfrReq: SaveDFSModifierEventRequest = {
      
      ModifierLookups: this.MultiSelectFormControl.value,
      ApplicationLookup: applicationLookup,
    };
    this.eacSvc.SaveDFSModifier(saveMdfrReq);

  }
  }

/**
 * 
 * Saves a modifier, saves a modifier to a project
 */
  public SaveModifier(projectLookup: string = null): void {
    if(this.ModifierFormGroup){
      const saveMdfrReq: SaveDFSModifierEventRequest = {
        Modifier: {
          ...this.EditingModifier,
          Name: this.NameFormControl.value,
          Enabled: this.EnabledFormControl.value,
          PathFilterRegex: this.PathFilterFormControl.value,
          Priority: this.PriorityFormControl.value,
          Type: this.CurrentType,
        },
        ModifierLookups: [this.EditingModifierLookup],
        ProjectLookups: [projectLookup],
      };

      let details = this.getDetails();

      saveMdfrReq.Modifier.Details = JSON.stringify(details);
    

      this.eacSvc.SaveDFSModifier(saveMdfrReq);
    }
    else if(this.ModifierSelectFormGroup){
      const saveMdfrReq: SaveDFSModifierEventRequest = {
        
        ModifierLookups: this.MultiSelectFormControl.value,
        ProjectLookups: [projectLookup],
      };
      this.eacSvc.SaveDFSModifier(saveMdfrReq);

    }
  }

  public SetEditingModifier(modifierLookup: string): void {
    this.EditingModifierLookup = modifierLookup;

    this.setupModifierForm();
  }

  public SetUseForProject(
    modifierLookup: string,
    change: MatSlideToggleChange
  ): void {
    this.SetEditingModifier(modifierLookup);

    this.SaveModifier(this.ProjectLookup);
  }

  public TypeChanged(event: MatSelectChange): void {
    this.CurrentType = event.value;

    this.setupTypeForm();
  }

  //  Helpers

  protected getDetails(): any{
    const details = {};

    switch (this.CurrentType) {
      case 'LCU.Runtime.Applications.Modifiers.HTMLBaseDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        break;

      case 'LCU.Runtime.Applications.Modifiers.LCURegDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        details['StateDataToken'] = this.StateDataTokenFormControl.value;
        break;

      case 'LCU.Runtime.Applications.Modifiers.ThirdPartyLibraryDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        details['Location'] = this.LocationFormControl.value;

        details['Script'] = this.ScriptFormControl.value;

        details['ScriptID'] = this.ScriptIDFormControl.value;
        break;
    }
    return details;
  }

  protected setupModifierSelectForm(){
    this.ModifierSelectFormGroup = this.formBldr.group({
      multiSelect: [this.ModifierLookups ? this.ModifierLookups : []]
    });

  }

  protected setupModifierForm(): void {
    if (this.EditingModifier != null) {
      this.CurrentType = this.EditingModifier?.Type;

      this.ModifierFormGroup = this.formBldr.group({
        name: [this.EditingModifier?.Name, Validators.required],
        type: [this.CurrentType, Validators.required],
        priority: [this.EditingModifier?.Priority ? this.EditingModifier?.Priority : 9000, Validators.required],
        enabled: [this.EditingModifier?.Enabled, []],
        pathFilter: [
          this.EditingModifier?.PathFilterRegex ? this.EditingModifier?.PathFilterRegex : "*index.html" ,
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

    const details = JSON.parse(this.EditingModifier?.Details || '{}');

    switch (this.CurrentType) {
      case 'LCU.Runtime.Applications.Modifiers.HTMLBaseDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        break;

      case 'LCU.Runtime.Applications.Modifiers.LCURegDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        this.ModifierFormGroup.addControl(
          'stateDataToken',
          this.formBldr.control(details?.StateDataToken || 'lcu-state-config', [
            Validators.required,
          ])
        );
        break;

      case 'LCU.Runtime.Applications.Modifiers.ThirdPartyLibraryDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
        this.ModifierFormGroup.addControl(
          'location',
          this.formBldr.control(details?.Location || '', [Validators.required])
        );

        this.ModifierFormGroup.addControl(
          'script',
          this.formBldr.control(details?.Script || '', [Validators.required])
        );

        this.ModifierFormGroup.addControl(
          'scriptId',
          this.formBldr.control(details?.ScriptID || '', [Validators.required])
        );
        break;
    }
  }

  
  

  


}
