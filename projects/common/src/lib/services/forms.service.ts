import { FormValuesModel } from './../models/form.values.model';
import { FormModel } from './../models/form.model';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FormsService {
    /**
     * List of forms
     */
    private _form: FormModel;
    public set Form(val: FormModel) {
        if (!val) {
            return;
        }

        this._form = val;
        this.forms.push(val);
        this.createValuesReference(val);
    }

    public get Form(): FormModel {
        return this._form;
    }

    /**
     * When any form is being edited
     */
    public FormIsDirty: Subject<boolean>;

    protected forms: Array<FormModel>;

    /**
     * Storage reference for intial form values
     */
    // public formsInitialValues: Array<FormModel>;
    protected previousFormValues: Array<FormValuesModel>;

    /**
     *
     * @param val as string - enabled form name
     * @param val as boolen - enable/disable all forms
     *
     * Enable / disable forms, use this when a form is being edited and
     * all other forms need to be disabled
     */
    public DisableForms(val: string | boolean): void {
        const preventEvent: { onlySelf: boolean; emitEvent: boolean } = {
            onlySelf: true,
            emitEvent: false,
        };

        this.forms.forEach((form: FormModel) => {
            if (typeof val === 'boolean') {
                val
                    ? form.Form.disable(preventEvent)
                    : form.Form.enable(preventEvent);
            } else {
                if (form.Id === val) {
                    form.Form.enable(preventEvent);
                } else {
                    form.Form.disable(preventEvent);
                }
            }
        });
    }

    /**
     * Create a reference of initial form data
     * Use this to compare if values really changed, because
     * the user could change values back to the original
     *
     * @param obj form data
     */
    protected createValuesReference(val: FormModel): void {
        // const values: Array<{key: string, value: string}> = [];
        const keyValues: object = {};

        for (const [key, value] of Object.entries(val.Form.controls)) {
            // values.push({key, value: value.value});
            keyValues[key] = value.value;
        }

        // this.formsValues.push(new FormValuesModel(val.Id, val.Form.value));
        this.previousFormValues.push(new FormValuesModel(val.Id, keyValues));
    }

    /**
     * Update value reference after saves
     *
     * @param val form model with values
     */
    public UpdateValuesReference(val: FormModel): void {
        const index: number = this.previousFormValues.findIndex(
            (x: FormValuesModel) => {
                return x.Id === val.Id;
            }
        );

        this.previousFormValues[index].Values = val.Form.value;

        // TODO: look at consolidating updating this.forms and this.previousFormValues - shannon (7-14-21)
        const formIndex: number = this.forms.findIndex((x: FormModel) => {
            return x.Id === val.Id;
        });

        this.forms[formIndex] = val;
    }

    /**
     * Reset form values back to previous
     *
     * @param id form id
     */
    public ResetFormValues(id: string): void {
        this.forms.find((form: FormModel) => {
            if (form.Id === id) {
                form.Form.patchValue(this.GetPreviousFormValues(id).Values);
            }
        });
    }

    /**
     *
     * @param id form id to search for
     *
     * @returns previous form values
     */
    public GetPreviousFormValues(id: string): FormValuesModel {
        return this.previousFormValues.find((x: FormValuesModel) => {
            return x.Id === id;
        });
    }

    /**
     * Check for actual form changes, because the user
     * could have canceled or changed the value back to the
     * original
     *
     * @param id form id
     * @param formToCheck form to be tested
     */
    public ForRealThough(id: string, formToCheck: FormGroup): boolean {
        const formVals: FormValuesModel = this.previousFormValues.find(
            (x: FormValuesModel) => {
                return x.Id === id;
            }
        );

        for (const key in formToCheck.controls) {
            if (formToCheck.controls[key].value !== formVals.Values[key]) {
                this.FormIsDirty.next(true);
                return true;
            }
        }

        this.FormIsDirty.next(false);
        return false;
    }

    constructor() {
        this.forms = [];
        this.previousFormValues = [];
        this.FormIsDirty = new Subject();
    }
}
