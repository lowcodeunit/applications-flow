import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    EaCApplicationAsCode,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-connected-source',
    templateUrl: './connected-source.component.html',
    styleUrls: ['./connected-source.component.scss'],
})
export class ConnectedSourceComponent implements OnInit {
    @Input('current-source')
    public CurrentSource: string;

    @Input('app-lookup')
    public ApplicationLookup: string;

    public get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<{}>;

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public get SourceControlLookups(): Array<string> {
        return Object.keys(this.Environment?.Sources || {});
    }

    public get SourceFormControl(): AbstractControl {
        return this.SourceFormGroup?.controls.source;
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public SourceFormGroup: FormGroup;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected formBldr: FormBuilder) {
        this.SaveFormEvent = new EventEmitter();

        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {
        this.setupSourceFormGroup();
    }

    public SourceSubmit() {
        console.log('submitting source values: ', this.SourceFormGroup.value);

        this.SaveFormEvent.emit(this.SourceFormGroup.value);
    }

    protected setupSourceFormGroup() {
        this.SourceFormGroup = this.formBldr.group({});

        this.setupSourceForm();
    }

    protected setupSourceForm(): void {
        console.log('current Source: ', this.CurrentSource);
        this.SourceFormGroup.addControl(
            'sourceControlLookup',
            this.formBldr.control(this.CurrentSource || '', [])
        );
    }
}
