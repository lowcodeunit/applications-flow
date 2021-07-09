import { FormModel } from './../models/form.model';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';


/**
 * Model for form values
 * 
 * Leaving this here, because 
 * this model is local only
 * 
 * TODO: if we start needing this model outside of this service,
 * need to move this into the models directory - shannon
 */
export class FormValues {
    public Id: string;
    public Values: object;

    constructor(id: string, values: object) {
        this.Id = id;
        this.Values = values;
    }
}

@Injectable({
    providedIn: 'root',
  })

export class FormsService {

    /**
     * List of forms
     */
    private _form: FormModel;
    public set Form(val: FormModel) {

        if (!val) { return; }

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
    public formsValues: Array<FormValues>;


    /**
     * 
     * @param val as string - enabled form name
     * @param val as boolen - enable/disable all forms
     * 
     * Enable / disable forms, use this when a form is being edited and 
     * all other forms need to be disabled
     */
    public DisableForms(val: string | boolean): void {

        this.forms.forEach((form: FormModel) => {

            if (typeof val === 'boolean') {
                val ? form.Form.disable({ onlySelf: true, emitEvent: false }) : form.Form.enable({ onlySelf: true, emitEvent: false });
            } else {
                if (form.Id === val) {
                    form.Form.enable({ onlySelf: true, emitEvent: false });
                } else {
                    form.Form.disable({ onlySelf: true, emitEvent: false });
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

        this.formsValues.push(new FormValues(val.Id, val.Form.value));
    }

    /**
     * Check for actual form changes, because the user
     * could have canceled or changed the value back to the
     * original
     *
     * @param form form to be tested
     */
    public ForRealThough(id: string, formToCheck: FormGroup): boolean {

        const formVals: FormValues = this.formsValues.find((x: FormValues) => {
            return x.Id === id;
        });

        // loop over the form to check and compare its values with
        // stored reference values we are holding on to
        for (const [key, value] of Object.entries(formToCheck.controls)) {
            for (const prop in value) {
                if (prop === 'value') {
                    const dirty: boolean = value[prop] !== formVals.Values[key];

                    // subscription for when any form is dirty
                    this.FormIsDirty.next(dirty);

                    return dirty;
                }
            }
        }
    }

    constructor() {
        this.forms = [];
        this.formsValues = [];
        this.FormIsDirty = new Subject();
    }
}
