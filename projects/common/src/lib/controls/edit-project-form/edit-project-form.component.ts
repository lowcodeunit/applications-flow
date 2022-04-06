import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { EaCProjectAsCode } from '@semanticjs/common';
import {
    EaCService,
    SaveProjectAsCodeEventRequest,
} from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-edit-project-form',
    templateUrl: './edit-project-form.component.html',
    styleUrls: ['./edit-project-form.component.scss'],
})
export class EditProjectFormComponent implements OnInit {
    @Input('project-lookup')
    public ProjectLookup: string;

    @Output('save-form-event')
    public SaveFormEvent: EventEmitter<{}>;

    public get DescriptionFormControl(): AbstractControl {
        return this.ProjectFormGroup.controls.description;
    }

    public get Project(): EaCProjectAsCode {
        return this.State?.EaC?.Projects[this.ProjectLookup];
    }

    public get NameFormControl(): AbstractControl {
        return this.ProjectFormGroup.controls.name;
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public ProjectFormGroup: FormGroup;

    constructor(protected eacSvc: EaCService, protected formBldr: FormBuilder) {
        this.SaveFormEvent = new EventEmitter();
    }

    ngOnInit(): void {
        this.setupProjectForm();
    }

    public SaveProject(): void {
        const proj: EaCProjectAsCode = this.Project;
        // console.log("APP=", app);
        proj.Project = {
            Name: this.NameFormControl.value,
            Description: this.DescriptionFormControl.value,
        };

        const saveProjReq: SaveProjectAsCodeEventRequest = {
            ProjectLookup: this.ProjectLookup,
            Project: proj,
        };

        this.eacSvc.SaveProjectAsCode(saveProjReq).then((res) => {
            this.SaveFormEvent.emit(res);
        });
    }

    public SubmitProjectControl() {
        console.log('application form: ', this.ProjectFormGroup.value);
        this.SaveProject();
    }

    protected setupProjectForm() {
        if (this.Project != null) {
            this.ProjectFormGroup = this.formBldr.group({
                name: [this.Project?.Project?.Name, Validators.required],
                description: [
                    this.Project?.Project?.Description,
                    Validators.required,
                ],
            });
        }
    }
}
