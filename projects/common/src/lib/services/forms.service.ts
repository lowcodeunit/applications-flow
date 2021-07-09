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

        if (!val) { return; }

        this._form = val;
        this.forms.push(val);
        debugger;
        this.createReference(val);
    }

    public get Form(): FormModel {
        return this._form;
    }

    public TestOne: FormModel;

    public TestTwo: any;

    protected forms: Array<FormModel>;

    /**
     * Storage reference for intial form values
     */
    public formsInitialValues: Array<FormModel>;
    public formsInitialValuesOnly: Array<any>;

    /**
     * When any form is being edited
     */
    // public FormIsDirty: Subject<{IsDirty: boolean, Id: string, Form: FormGroup}>;

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
    protected createReference(val: FormModel): void {

        debugger;
        // this.formsInitialValues.push(Object.assign({}, val));
        this.formsInitialValuesOnly.push({Id: val.Id, values: val.Form.value});
    }

    /**
     * Check for actual form changes, because the user
     * could have canceled or changed the value back to the 
     * original
     * 
     * @param form form to be tested
     */
    public ForRealThough(id: string, formToCheck: FormGroup): boolean {
        let hasChanged: boolean = false;

        // let f: any = this.formsInitialValues.filter((item, index) => {
        //     return item.Id === id;
        // });
        debugger;
        const formInitialValues: FormModel = this.formsInitialValues.find((x: FormModel) => {
            return x.Id === id;
        });

        for (const prop in formToCheck.controls) {
            // if (prop) {
            //     debugger;
            //     return formInitialValues[prop] !== formToCheck[prop];
            // }


            // if (this.hasChanged(formInitialValues.Form, prop)) {
            //     return true;
            // } else {
            //     return false;
            // }
        }

        for (const [key, value] of Object.entries(formToCheck.controls)) {
            
            for (const prop in value) {
                if (prop === 'value') {
                    debugger;
                    return value[prop] !== formInitialValues.Form.controls[key][prop];
                }
            }
        }

        // for (const prop in form) {
        //     if (this.hasChanged(form, prop)) {
        //         hasChanged = true;
        //     }
        // }
    }

    /**
     * Compare initial values with the current values
     * 
     * @param obj form data
     * @param prop property to check
     * @returns boolean of whether or not the values changed
     */
    protected hasChanged(form: FormGroup, prop: string): boolean {
        return true;
       // return this.reference[prop] !== form[prop];
    }

    constructor() {
        this.forms = [];
        this.formsInitialValues = [];
        this.formsInitialValuesOnly = [];
    }
}
