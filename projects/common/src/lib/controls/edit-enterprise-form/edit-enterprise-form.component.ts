import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { EaCEnterpriseDetails, EnterpriseAsCode } from '@semanticjs/common';
import {
    EaCService,
    SaveEnvironmentAsCodeEventRequest,
} from '../../services/eac.service';

@Component({
    selector: 'lcu-edit-enterprise-form',
    templateUrl: './edit-enterprise-form.component.html',
    styleUrls: ['./edit-enterprise-form.component.scss'],
})
export class EditEnterpriseFormComponent implements OnInit {
    @Input('enterprise')
    public Enterprise: EaCEnterpriseDetails;

    @Input('loading')
    public Loading: boolean;

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<any>;

    public get DescriptionFormControl(): AbstractControl {
        return this.EnterpriseFormGroup?.controls.description;
    }

    public get NameFormControl(): AbstractControl {
        return this.EnterpriseFormGroup?.controls.name;
    }

    public EnterpriseFormGroup: FormGroup;

    constructor(protected formBldr: FormBuilder, protected eacSvc: EaCService) {
        this.SaveFormEvent = new EventEmitter();
    }

    public ngOnInit(): void {}

    public ngOnChanges(): void {
        this.setupEditEnterpriseForm();
    }

    public SubmitEnterpriseControl() {
        console.log('Enterprise form: ', this.EnterpriseFormGroup.value);
        this.SaveEnterpriseDetails();
    }

    public SaveEnterpriseDetails() {
        const eac: EnterpriseAsCode = {
            Enterprise: {
                Name: this.NameFormControl.value,
                Description: this.DescriptionFormControl.value,
            },
        };
        console.log('SAve eac: ', eac);

        this.eacSvc.SaveEnterpriseAsCode(eac).then((res) => {
            this.SaveFormEvent.emit(res);
        });
    }

    protected setupEditEnterpriseForm() {
        if (this.Enterprise) {
            this.EnterpriseFormGroup = this.formBldr.group({
                name: [this.Enterprise?.Name, Validators.required],
                description: [
                    this.Enterprise?.Description,
                    Validators.required,
                ],
            });
        }
    }
}
