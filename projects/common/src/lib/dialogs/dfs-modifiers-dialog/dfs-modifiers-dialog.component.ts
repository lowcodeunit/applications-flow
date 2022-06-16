import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { DFSModifiersFormComponent } from '../../controls/dfs-modifiers-form/dfs-modifiers-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface DFSModifiersDialogData {
    applicationLookup?: string;
    modifierLookup?: string;
    modifierName?: string;
    // modifiers:  { [lookup: string]: EaCDFSModifier };
    level: string;
    projectLookup?: string;
}

@Component({
    selector: 'lcu-dfs-modifiers-dialog',
    templateUrl: './dfs-modifiers-dialog.component.html',
    styleUrls: ['./dfs-modifiers-dialog.component.scss'],
})
export class DFSModifiersDialogComponent implements OnInit {
    @ViewChild(DFSModifiersFormComponent)
    public DFSModifersFormControls: DFSModifiersFormComponent;

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {});
    }

    public get DFSModifersFormGroup(): FormGroup {
        return this.DFSModifersFormControls?.ModifierFormGroup;
    }

    public get SelectedModifiersFormGroup(): FormGroup {
        return this.DFSModifersFormControls?.ModifierSelectFormGroup;
    }

    public ErrorMessage: string;

    public ModifierDialogForm: FormGroup;

    public SaveDisabled: boolean;

    constructor(
        protected eacSvc: EaCService,
        public formbldr: FormBuilder,
        public dialogRef: MatDialogRef<DFSModifiersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DFSModifiersDialogData,
        protected snackBar: MatSnackBar
    ) {
        this.ModifierDialogForm = this.formbldr.group({});
    }

    public ngOnInit(): void {
        this.determineLevel();
    }

    public CloseDialog() {
        this.dialogRef.close();
    }

    public DeleteModifier(): void {
        this.eacSvc.DeleteModifier(
            this.data.modifierLookup,
            this.data.modifierName
        );
    }

    public HandleSaveFormEvent(event: Status) {
        console.log('event: ', event);
        if (event.Code === 0) {
            this.snackBar.open('DFS Modifier Saved Successfully', 'Dismiss', {
                duration: 5000,
            });
            this.CloseDialog();
        } else {
            this.ErrorMessage = event.Message;
        }
    }

    public IsDisabled() {
        this.SaveDisabled = true;
        if (this.DFSModifersFormGroup) {
            this.SaveDisabled =
                !this.DFSModifersFormGroup?.valid ||
                !this.ModifierDialogForm?.valid;
        } else if (this.SelectedModifiersFormGroup) {
            this.SaveDisabled =
                !this.SelectedModifiersFormGroup?.valid ||
                !this.SelectedModifiersFormGroup?.dirty;
        }
        return this.SaveDisabled;
    }

    public IsPreconfigured(): boolean {
        if (this.data.modifierLookup) {
            if (
                this.data.modifierLookup === 'html-base' ||
                this.data.modifierLookup === 'lcu-reg'
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public SaveDFSModifier() {
        // console.log("level at save: ", this.data.level)

        switch (this.data.level) {
            case 'enterprise': {
                if (this.ModifierDialogForm.controls.applyToAllProjects.value) {
                    //save modifier add it to the ModifierLookups of all projects
                    this.DFSModifersFormControls.SaveModifierForAllProjects(
                        this.ProjectLookups
                    );
                } else {
                    //save modifier
                    this.DFSModifersFormControls.SaveModifier();
                }
            }
            case 'project': {
                this.DFSModifersFormControls.SaveModifier(
                    this.data.projectLookup
                );
            }

            case 'application': {
                this.DFSModifersFormControls.SaveModifierForApplication(
                    this.data.applicationLookup
                );
            }
        }
        // this.DFSModifersFormControls.SaveModifier();
    }

    protected determineLevel() {
        // console.log("LEVEL: ", this.data.level)
        switch (this.data.level) {
            case 'enterprise': {
                this.setupEntForm();
            }
        }
    }

    protected setupEntForm() {
        this.ModifierDialogForm.addControl(
            'applyToAllProjects',
            this.formbldr.control(false)
        );
    }
}
