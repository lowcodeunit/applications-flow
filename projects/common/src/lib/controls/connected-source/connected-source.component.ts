import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { EaCSourceControl } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-connected-source',
    templateUrl: './connected-source.component.html',
    styleUrls: ['./connected-source.component.scss'],
})
export class ConnectedSourceComponent implements OnInit {
    @Input('current-source')
    public CurrentSource: string;

    @Input('source-controls')
    public SourceControls: { [lookup: string]: EaCSourceControl };

    @Input('source-control-lookups')
    public SourceControlLookups: Array<string>;

    @Input('loading')
    public Loading: boolean;

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<{}>;

    // public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    //     return this.Environment?.Sources || {};
    // }

    // public get SourceControlLookups(): Array<string> {
    //     return Object.keys(this.SourceControls || {});
    // }

    public get SourceFormControl(): AbstractControl {
        return this.SourceFormGroup?.controls.source;
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
        this.SourceFormGroup.addControl(
            'sourceControlLookup',
            this.formBldr.control(this.CurrentSource || '', [])
        );
    }
}
