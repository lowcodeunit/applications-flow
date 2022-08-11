import { Component, Input, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {
    EaCApplicationAsCode,
    EaCDFSModifier,
    EaCProjectAsCode,
} from '@semanticjs/common';
import { Guid, Status } from '@lcu/common';
import { MatSelectChange } from '@angular/material/select';
import {
    EaCService,
    SaveDFSModifierEventRequest,
} from '../../services/eac.service';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
    selector: 'lcu-dfs-modifier-form',
    templateUrl: './dfs-modifiers-form.component.html',
    styleUrls: ['./dfs-modifiers-form.component.scss'],
})
export class DFSModifiersFormComponent implements OnInit {
    //  Fields

    //  Properties
    public CurrentType: string;

    @Input('editing-modifier-lookup')
    public EditingModifierLookup: string;

    @Input('applications')
    public Applications: EaCApplicationAsCode;

    @Input('application-lookup')
    public ApplicationLookup: string;

    @Input('projects')
    public Projects: Array<EaCProjectAsCode>;

    @Input('project-lookup')
    public ProjectLookup: string;

    @Input('modifiers')
    public Modifiers: { [lookup: string]: EaCDFSModifier };

    /**which level is the dfs modifier being edited ent project or app */
    @Input('level')
    public Level: string;

    // public get Details(): any {
    //   return JSON.stringify(this.EditingModifier?.Details);
    // }

    public get DetailsFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.details;
    }

    public get EnabledFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.enabled;
    }

    public get EnterprisesModifierLookups(): Array<string> {
        return Object.keys(this.Modifiers || {});
    }

    public get LocationFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.location;
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

    public get ScriptFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.script;
    }

    public get ScriptIDFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.scriptId;
    }

    public get ScriptTypeFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.scriptType;
    }

    public get StateDataTokenFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.stateDataToken;
    }

    public get TypeFormControl(): AbstractControl {
        return this.ModifierFormGroup?.controls.type;
    }

    public EditingModifier: EaCDFSModifier;

    public ModifierFormGroup: FormGroup;

    public ModifierSelectFormGroup: FormGroup;

    public ModifierLookups: Array<string>;

    public Project: EaCProjectAsCode;

    //  Constructors
    constructor(
        protected formBldr: FormBuilder,
        protected appsFlowSvc: ApplicationsFlowService,
        protected eacSvc: EaCService
    ) {
        // this.EditingModifierLookup = null;
    }

    //  Life Cycle
    public ngOnInit(): void {}

    public ngOnChanges(): void {
        if (this.ProjectLookup) {
            this.ModifierLookups =
                this.Projects[this.ProjectLookup]?.ModifierLookups;
        } else if (this.ApplicationLookup) {
            this.ModifierLookups =
                this.Applications[this.ApplicationLookup]?.ModifierLookups;
        } else {
            this.ModifierLookups = Object.keys(this.Modifiers || {});
        }

        let mdfr = this.Modifiers
            ? this.Modifiers[this.EditingModifierLookup]
            : null;

        if (mdfr == null && this.EditingModifierLookup) {
            mdfr = {};
        }
        this.EditingModifier = mdfr;

        if (this.ProjectLookup && this.Projects) {
            this.Project = this.Projects[this.ProjectLookup];
        }

        if (this.Level === 'enterprise' && !this.EditingModifierLookup) {
            this.CreateNewModifier();
        } else if (this.EditingModifierLookup) {
            this.setupModifierForm();
        } else {
            this.setupModifierSelectForm();
        }
    }

    //  API Methods
    public CreateNewModifier(): void {
        console.log('CREATE NEW MOD');
        this.SetEditingModifier(Guid.CreateRaw());
    }

    public DeleteModifier(modifierLookup: string, modifierName: string): void {
        this.eacSvc.DeleteModifier(modifierLookup, modifierName).then();
    }

    // public DetermineSave(){

    // }

    public SaveModifierForAllProjects(projectLookups: Array<string>): Status {
        let saveStatus: Status;
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

        this.eacSvc.SaveDFSModifier(saveMdfrReq).then((status) => {
            saveStatus = status;
        });
        return saveStatus;
    }

    public SaveModifierForApplication(applicationLookup: string): Status {
        let saveStatus: Status;
        if (this.ModifierFormGroup) {
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

            this.eacSvc.SaveDFSModifier(saveMdfrReq).then((status) => {
                saveStatus = status;
            });
        } else if (this.ModifierSelectFormGroup) {
            const saveMdfrReq: SaveDFSModifierEventRequest = {
                ModifierLookups: this.MultiSelectFormControl.value,
                ApplicationLookup: applicationLookup,
            };
            this.eacSvc.SaveDFSModifier(saveMdfrReq).then((status) => {
                saveStatus = status;
            });
        }
        return saveStatus;
    }

    /**
     *
     * Saves a modifier, saves a modifier to a project
     */
    public SaveModifier(projectLookup: string = null): Status {
        let saveStatus: Status;
        if (this.ModifierFormGroup) {
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

            this.eacSvc.SaveDFSModifier(saveMdfrReq).then((status) => {
                saveStatus = status;
            });
        } else if (this.ModifierSelectFormGroup) {
            const saveMdfrReq: SaveDFSModifierEventRequest = {
                ModifierLookups: this.MultiSelectFormControl.value,
                ProjectLookups: [projectLookup],
            };
            this.eacSvc.SaveDFSModifier(saveMdfrReq).then((status) => {
                saveStatus = status;
            });
        }
        return saveStatus;
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

    protected getDetails(): any {
        const details = {};

        switch (this.CurrentType) {
            case 'LCU.Runtime.Applications.Modifiers.HTMLBaseDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
                break;

            case 'LCU.Runtime.Applications.Modifiers.LCURegDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
                details['StateDataToken'] =
                    this.StateDataTokenFormControl.value;
                break;

            case 'LCU.Runtime.Applications.Modifiers.ThirdPartyLibraryDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
                details['Location'] = this.LocationFormControl.value;

                details['Script'] = this.ScriptFormControl.value;

                details['ScriptType'] = this.ScriptTypeFormControl.value;

                details['ScriptID'] = this.ScriptIDFormControl.value;
                break;
        }
        return details;
    }

    protected setupModifierSelectForm() {
        console.log('setup mod select form');
        this.ModifierSelectFormGroup = this.formBldr.group({
            multiSelect: [this.ModifierLookups ? this.ModifierLookups : []],
        });
    }

    protected setupModifierForm(): void {
        console.log('editing mod: ', this.EditingModifier);
        if (this.EditingModifier != null) {
            this.CurrentType = this.EditingModifier?.Type;

            this.ModifierFormGroup = this.formBldr.group({
                name: [this.EditingModifier?.Name, Validators.required],
                type: [this.CurrentType, Validators.required],
                priority: [
                    this.EditingModifier?.Priority
                        ? this.EditingModifier?.Priority
                        : 9000,
                    Validators.required,
                ],
                enabled: [this.EditingModifier?.Enabled, []],
                pathFilter: [
                    this.EditingModifier?.PathFilterRegex
                        ? this.EditingModifier?.PathFilterRegex
                        : '*index.html',
                    Validators.required,
                ],
            });

            this.setupTypeForm();
        } else {
            console.log('setup new form');
            this.ModifierFormGroup = this.formBldr.group({
                name: ['', Validators.required],
                type: ['', Validators.required],
                priority: ['', Validators.required],
                enabled: ['', []],
                pathFilter: ['', Validators.required],
            });
        }
    }

    protected setupTypeForm(): void {
        this.ModifierFormGroup.removeControl('stateDataToken');

        this.ModifierFormGroup.removeControl('location');
        this.ModifierFormGroup.removeControl('script');
        this.ModifierFormGroup.removeControl('scriptId');
        this.ModifierFormGroup.removeControl('scriptType');

        const details = JSON.parse(this.EditingModifier?.Details || '{}');

        switch (this.CurrentType) {
            case 'LCU.Runtime.Applications.Modifiers.HTMLBaseDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
                break;

            case 'LCU.Runtime.Applications.Modifiers.LCURegDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
                this.ModifierFormGroup.addControl(
                    'stateDataToken',
                    this.formBldr.control(
                        details?.StateDataToken || 'lcu-state-config',
                        [Validators.required]
                    )
                );
                break;

            case 'LCU.Runtime.Applications.Modifiers.ThirdPartyLibraryDFSModifierManager, LCU.Runtime, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null':
                this.ModifierFormGroup.addControl(
                    'location',
                    this.formBldr.control(details?.Location || 'Head', [
                        Validators.required,
                    ])
                );

                this.ModifierFormGroup.addControl(
                    'script',
                    this.formBldr.control(details?.Script || '', [
                        Validators.required,
                    ])
                );

                this.ModifierFormGroup.addControl(
                    'scriptId',
                    this.formBldr.control(details?.ScriptID || '', [
                        Validators.required,
                    ])
                );

                this.ModifierFormGroup.addControl(
                    'scriptType',
                    this.formBldr.control(details?.ScriptType || 'Control')
                );
                break;
        }
    }
}
