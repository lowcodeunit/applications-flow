import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Guid, Status } from '@lcu/common';
// import { jsonValidator } from '@lcu/common';

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

    public StateConfigValid: boolean;

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

    // public CheckJSON(){
    //     this.isJsonString(this.StateConfigValueFormControl.value);
    // }

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
        // TODO update lcu/common package and add Validators.compose(Validators.required, jsonValidator)
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

    // protected isJsonString(str:string) {
    //     console.log("string: ", str)
    //     let test = JSON.parse(str);
    //     console.log("json: ", test)
    //     try {
    //         let test = JSON.parse(str);
    //         console.log("json: ", test)
    //     } catch (e) {
    //         this.StateConfigValid = false;
    //         // return false;
    //     }
    //     this.StateConfigValid = true;
    //     // return true;
    // }
}
