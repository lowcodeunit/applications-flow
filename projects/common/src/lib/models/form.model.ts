import { FormGroup } from '@angular/forms';
export class FormModel {

    /**
     * Form Id
     */
    public Id: string;

    /**
     * Form
     */
    public Form: FormGroup;

    constructor(opts: FormModel) {
        Object.assign(this, opts); // destructure values
    }
}