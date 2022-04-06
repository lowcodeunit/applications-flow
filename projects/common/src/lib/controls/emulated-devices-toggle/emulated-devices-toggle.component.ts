import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-emulated-devices-toggle',
    templateUrl: './emulated-devices-toggle.component.html',
    styleUrls: ['./emulated-devices-toggle.component.scss'],
})
export class EmulatedDevicesToggleComponent implements OnInit {
    @Input('editing-application')
    public EditingApplication: EaCApplicationAsCode;

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<{}>;

    public get IsPrivateFormControl(): AbstractControl {
        return this.EmulatedDevicesFormGroup?.controls.isPrivate;
    }

    public get IsTriggerSignInFormControl(): AbstractControl {
        return this.EmulatedDevicesFormGroup?.controls.isTriggerSignIn;
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public EmulatedDevicesFormGroup: FormGroup;

    public ProcessorType: string;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected formBldr: FormBuilder) {
        this.SaveFormEvent = new EventEmitter();
        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {
        this.setupEmulatedDevicesFormGroup();
    }

    public EmulatedDevicesSubmit() {
        //save the EmulatedDevices settings
        console.log(
            'submitting EmulatedDevices values: ',
            this.EmulatedDevicesFormGroup.value
        );
        this.SaveFormEvent.emit(this.EmulatedDevicesFormGroup.value);
    }

    protected setupEmulatedDevicesFormGroup() {
        this.ProcessorType = this.EditingApplication?.Processor?.Type || '';
        this.EmulatedDevicesFormGroup = this.formBldr.group({});
        this.setupEmulatedDevicesForm();
    }

    protected setupEmulatedDevicesForm(): void {
        this.EmulatedDevicesFormGroup.addControl(
            'isEmulated',
            this.formBldr.control(
                this.EditingApplication.LookupConfig?.IsPrivate || false,
                [Validators.required]
            )
        );
    }
}
