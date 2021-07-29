import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectState } from '../state/applications-flow.state';
import { CardFormConfigModel } from './card-form-config.model';

export class BaseFormConfigModel {

    public CardConfig?: CardFormConfigModel;
    public Form?: FormGroup;
    public FormName: string;
    public IsDirty?: boolean;

    constructor(opts: BaseFormConfigModel) {
        Object.assign(this, opts); // destructure values
    }
}