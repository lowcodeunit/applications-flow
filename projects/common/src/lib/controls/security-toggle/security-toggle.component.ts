import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-security-toggle',
    templateUrl: './security-toggle.component.html',
    styleUrls: ['./security-toggle.component.scss'],
})
export class SecurityToggleComponent implements OnInit {
    @Input('editing-application')
    public EditingApplication: EaCApplicationAsCode;

    @Input('loading')
    public Loading: boolean;

    @Input('access-rights')
    public AccessRights: any;

    @Input('license-configs')
    public LicenseConfigs: any;

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<{}>;

    public get AccessRightsFormControl(): AbstractControl {
        return this.SecurityFormGroup?.controls.accessRights;
    }

    public get IsPrivateFormControl(): AbstractControl {
        return this.SecurityFormGroup?.controls.isPrivate;
    }

    public get IsTriggerSignInFormControl(): AbstractControl {
        return this.SecurityFormGroup?.controls.isTriggerSignIn;
    }

    public get LicenseConfigsFormControl(): AbstractControl {
        return this.SecurityFormGroup?.controls.licenseConfigs;
    }

    public IsPrivate: boolean;

    public SecurityFormGroup: FormGroup;

    public ProcessorType: string;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected formBldr: FormBuilder) {
        this.SaveFormEvent = new EventEmitter();
        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {}

    public ngOnChanges() {
        if (this.IsPrivate === null || this.IsPrivate === undefined) {
            this.IsPrivate = this.EditingApplication.LookupConfig?.IsPrivate;
            this.setupSecurityFormGroup();
        }
    }

    public SecuritySubmit() {
        //save the security settings
        console.log(
            'submitting security values: ',
            this.SecurityFormGroup.value
        );
        this.SaveFormEvent.emit(this.SecurityFormGroup.value);
    }

    public HandleIsPrivate(event: any) {
        this.IsPrivate = this.IsPrivateFormControl.value;
    }

    protected setupSecurityFormGroup() {
        // console.log('setting form');
        this.ProcessorType = this.EditingApplication?.Processor?.Type || '';
        this.SecurityFormGroup = this.formBldr.group({});
        this.setupSecurityForm();
    }

    protected setupSecurityForm(): void {
        this.SecurityFormGroup.addControl(
            'isPrivate',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.IsPrivate || false,
                [Validators.required]
            )
        );

        this.SecurityFormGroup.addControl(
            'isTriggerSignIn',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.IsTriggerSignIn || false,
                [Validators.required]
            )
        );

        this.SecurityFormGroup.addControl(
            'accessRights',
            this.formBldr.control(this.EditingApplication?.AccessRightLookups)
        );

        this.SecurityFormGroup.addControl(
            'licenseConfigs',
            this.formBldr.control(
                this.EditingApplication?.LicenseConfigurationLookups
            )
        );
    }
}
