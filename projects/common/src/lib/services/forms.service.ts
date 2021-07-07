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
    public Forms: Array<{Id: string, Form: FormGroup}>;

    protected reference: any;

    /**
     * When any form is being edited
     */
    public FormIsDirty: Subject<{IsDirty: boolean, Id: string, Form: FormGroup}>;

    public DisableForms(val: string | boolean): void {

        this.Forms.forEach((form: { Id: string, Form: FormGroup }) => {

            // enable/disable all forms
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
    public CreateReference(obj: any): void {
        this.reference = Object.assign({}, obj);
    }

    /**
     * Pass in the form to be checked.
     * Will do this a bit different, as I
     * want to hold an array of forms and their values,
     * or something like that.
     * 
     * @param form form to be tested
     */
    public SubmitForm(form: FormGroup): void {
        let hasChanged: boolean = false;

        for (const prop in form) {
            if (this.formHasChanged(form, prop)) {
                hasChanged = true;
            }
        }
    }

    /**
     * Compare initial values with the current values
     * 
     * @param obj form data
     * @param prop property to check
     * @returns boolean of whether or not the values changed
     */
    protected formHasChanged(obj: any, prop: string): boolean {
        return this.reference[prop] !== obj[prop];
    }

    constructor() {
        this.Forms = [];
        this.FormIsDirty = new Subject();
    }
}
