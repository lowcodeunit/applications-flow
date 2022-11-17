import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Guid, Status } from '@lcu/common';
import { EaCApplicationAsCode, EaCDataToken } from '@semanticjs/common';
import {
    EaCService,
    SaveApplicationAsCodeEventRequest,
} from '../../services/eac.service';

@Component({
    selector: 'lcu-state-config-form',
    templateUrl: './state-config-form.component.html',
    styleUrls: ['./state-config-form.component.scss'],
})
export class StateConfigFormComponent implements OnInit {
    @Input('app-lookup')
    public AppLookup: string;

    @Input('application')
    public Application: EaCApplicationAsCode;

    @Input('config')
    public Config: EaCDataToken;

    @Output('status-event')
    public StatusEvent: EventEmitter<Status>;

    public get StateConfigNameFormControl(): AbstractControl {
        return this.StateConfigForm?.controls?.name;
    }

    public get StateConfigDescriptionFormControl(): AbstractControl {
        return this.StateConfigForm?.controls?.description;
    }

    public get StateConfigValueFormControl(): AbstractControl {
        return this.StateConfigForm?.controls?.value;
    }

    public StateConfigForm: FormGroup;

    constructor(protected eacSvc: EaCService, public formbldr: FormBuilder) {
        this.StateConfigForm = this.formbldr.group({});

        this.StatusEvent = new EventEmitter();
    }

    public ngOnInit(): void {
        this.buildForm();
    }

    public ngOnChanges(): void {}

    public SaveStateConfig() {
        let app = this.Application;

        // console.log('APP = ', app);

        app.DataTokens['lcu-state-config'] = {
            Name: this.StateConfigNameFormControl?.value,
            Description: this.StateConfigDescriptionFormControl?.value,
            Value: this.StateConfigValueFormControl?.value,
        };
        const saveAppReq: SaveApplicationAsCodeEventRequest = {
            ApplicationLookup: this.AppLookup || Guid.CreateRaw(),
            Application: app,
        };
        this.eacSvc.SaveApplicationAsCode(saveAppReq).then((res) => {
            this.StatusEvent.emit(res);
        });
    }

    protected buildForm() {
        this.StateConfigForm.addControl(
            'name',
            this.formbldr.control(this.Config?.Name ? this.Config?.Name : '', [
                Validators.required,
            ])
        );

        this.StateConfigForm.addControl(
            'description',
            this.formbldr.control(
                this.Config?.Description ? this.Config?.Description : '',
                [Validators.required]
            )
        );

        this.StateConfigForm.addControl(
            'value',
            this.formbldr.control(
                this.Config?.Value
                    ? JSON.stringify(
                          JSON.parse(this.Config?.Value),
                          undefined,
                          4
                      )
                    : '',
                [Validators.required]
            )
        );
    }
}
