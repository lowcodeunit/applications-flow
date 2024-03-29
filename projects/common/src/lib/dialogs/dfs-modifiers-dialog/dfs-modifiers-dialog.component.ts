import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { Subscription } from 'rxjs';
import { DFSModifiersFormComponent } from '../../controls/dfs-modifiers-form/dfs-modifiers-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface DFSModifiersDialogData {
    applicationLookup?: string;
    modifierLookup?: string;
    modifierName?: string;
    level: string;
    projectLookup?: string;
}

@Component({
    selector: 'lcu-dfs-modifiers-dialog',
    templateUrl: './dfs-modifiers-dialog.component.html',
    styleUrls: ['./dfs-modifiers-dialog.component.scss'],
})
export class DFSModifiersDialogComponent implements OnInit, OnDestroy {
    @ViewChild(DFSModifiersFormComponent)
    public DFSModifersFormControls: DFSModifiersFormComponent;

    public get DFSModifersFormGroup(): FormGroup {
        return this.DFSModifersFormControls?.ModifierFormGroup;
    }

    public get SelectedModifiersFormGroup(): FormGroup {
        return this.DFSModifersFormControls?.ModifierSelectFormGroup;
    }

    public Applications: Array<EaCApplicationAsCode>;

    public ErrorMessage: string;

    public IsPreconfigured: boolean;

    public ModifierDialogForm: FormGroup;

    public SaveDisabled: boolean;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public ProjectLookups: Array<string>;

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
        // console.log('dfs data: ', this.data);
        this.StateSub = this.eacSvc.State.subscribe((state) => {
            this.State = state;
            if (this.State?.EaC?.Projects) {
                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                );
            }
        });
        this.determineLevel();

        this.IsPreconfigured = this.CheckPreconfigured();
    }

    public ngOnDestroy(): void {
        this.StateSub.unsubscribe();
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
        // console.log('event: ', event);
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
                !this.DFSModifersFormGroup?.dirty ||
                !this.ModifierDialogForm?.valid;
        } else if (this.SelectedModifiersFormGroup) {
            this.SaveDisabled =
                !this.SelectedModifiersFormGroup?.valid ||
                !this.SelectedModifiersFormGroup?.dirty;
        }
        // console.log('Save disabled: ', this.SaveDisabled);
        return this.SaveDisabled;
    }

    public CheckPreconfigured(): boolean {
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
        // console.log('level at save: ', this.data.level);

        let status: Status;

        switch (this.data.level) {
            case 'enterprise': {
                if (this.ModifierDialogForm.controls.applyToAllProjects.value) {
                    //save modifier add it to the ModifierLookups of all projects
                    status =
                        this.DFSModifersFormControls.SaveModifierForAllProjects(
                            this.ProjectLookups
                        );
                } else {
                    //save modifier
                    status = this.DFSModifersFormControls.SaveModifier();
                }
            }
            case 'project': {
                status = this.DFSModifersFormControls.SaveModifier(
                    this.data.projectLookup
                );
            }

            case 'application': {
                status =
                    this.DFSModifersFormControls.SaveModifierForApplication(
                        this.data.applicationLookup
                    );
            }
        }
        if (status?.Code === 0) {
            this.snackBar.open('DFS Modifier Saved Successfully', 'Dismiss', {
                duration: 5000,
            });
        } else {
            this.snackBar.open('DFS Modifier Failed to Save', 'Dismiss', {
                duration: 5000,
            });
        }
        // this.DFSModifersFormControls.SaveModifier();
    }

    protected determineLevel() {
        // console.log('LEVEL: ', this.data.level);
        switch (this.data.level.toLowerCase()) {
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
