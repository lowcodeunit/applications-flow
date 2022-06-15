import { BaseFormConfigModel } from './../../models/base-form-config.model';
import { Component, OnInit } from '@angular/core';
import { EaCService } from '../../services/eac.service';
import { FormsService } from '../../services/forms.service';

@Component({
    selector: 'lcu-base-form',
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss'],
})
export class BaseFormComponent implements OnInit {
    /**
     * FormGroup for project name card
     */
    // public Form: FormGroup;

    /**
     * Form name
     */
    // protected formName: string;

    /**
     * When form is dirty, ties into formsService.DisableForms
     */
    // public IsDirty: boolean;

    public FormConfig: BaseFormConfigModel;

    constructor(
        protected formsService: FormsService,
        protected eac: EaCService
    ) {}

    public ngOnInit(): void {
        this.setupForm();
    }

    protected setupForm(): void {
        this.formsService.Form = {
            Id: this.FormConfig.FormName,
            Form: this.FormConfig.Form,
        };

        // this.onChange();
    }

    /**
     * Listen to form value changes
     */
    protected onChange(): void {}

    protected checkFormForChanges(): void {
        this.FormConfig.Form.valueChanges.subscribe((val: object) => {
            if (
                this.formsService.ForRealThough(
                    this.FormConfig.FormName,
                    this.FormConfig.Form
                )
            ) {
                this.FormConfig.IsDirty = true;
                // disable all forms except the current form being edited
                this.formsService.DisableForms(this.FormConfig.FormName);
            } else {
                this.FormConfig.IsDirty = false;
                // enable all forms
                this.formsService.DisableForms(false);
            }
        });
    }

    /**
     * Update Form value reference
     */
    protected updateValueRef(): void {
        this.formsService.UpdateValuesReference({
            Id: this.FormConfig.FormName,
            Form: this.FormConfig.Form,
        });
    }

    protected save(): void {
        console.log('PARENT SAVE');
    }

    protected resetForm(): void {}
}
