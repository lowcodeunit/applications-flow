import { Component, Input, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormsService } from '../../../../../../../services/forms.service';
import { CardFormConfigModel } from '../../../../../../../models/card-form-config.model';
import { EaCService } from '../../../../../../../services/eac.service';
import { EaCProjectAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss'],
})
export class ProjectNameComponent implements OnInit {
    /**
     * Form button actions
     */
    public Config: CardFormConfigModel;

    /**
     * Access form control for description
     */
    public get Description(): AbstractControl {
        return this.Form.get('description');
    }

    /**
     * FormGroup for project name card
     */
    public Form: FormGroup;

    /**
     * Name of form
     */
    protected formName: string;

    /**
     * When form is dirty, ties into formsService.DisableForms
     */
    public IsDirty: boolean;

    /**
     * Access form control for project name
     */
    public get Name(): AbstractControl {
        return this.Form.get('name');
    }

    /**
     * Input value for state
     */
    @Input('project')
    public Project: EaCProjectAsCode;

    @Input('project-lookup')
    public ProjectLookup: string;

    constructor(
        protected formsService: FormsService,
        protected eacSvc: EaCService
    ) {}

    public ngOnInit(): void {
        this.formName = 'ProjectNameForm';

        this.setupForm();

        this.config();
    }

    /**
     * Form configurations
     */
    protected config(): void {
        this.Config = new CardFormConfigModel({
            Icon: 'house',
            Title: 'Root Directory',
            Subtitle:
                'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory',
            FormActions: {
                Message: 'Changes will be applied to your next deployment',
                Actions: [
                    {
                        Label: 'Reset',
                        Color: 'warn',
                        ClickEvent: () => this.resetForm(),
                        // use arrow function, so 'this' refers to ProjectNameComponent
                        // if we used ClickeEvent: this.clearForm, then 'this' would refer to this current Actions object
                        Type: 'RESET',
                    },
                    {
                        Label: 'Save',
                        Color: 'accent',
                        ClickEvent: () => this.save(),
                        Type: 'SAVE',
                    },
                ],
            },
        });
    }
    /**
     * Setup form controls
     */
    protected setupForm(): void {
        this.Form = new FormGroup({
            name: new FormControl(this.Project?.Project?.Name || '', {
                validators: [Validators.required, Validators.minLength(1)],
                updateOn: 'change',
            }),
            description: new FormControl(
                this.Project?.Project?.Description || '',
                {
                    validators: [Validators.required, Validators.minLength(1)],
                    updateOn: 'change',
                }
            ),
        });

        this.formsService.Form = { Id: this.formName, Form: this.Form };

        this.onChange();
    }

    /**
     * Save form
     */
    protected save(): void {
        this.eacSvc.SaveProjectAsCode({
            ProjectLookup: this.ProjectLookup,
            Project: {
                ...this.Project,
                Project: {
                    ...(this.Project || {}),
                    Description: this.Description.value,
                    Name: this.Name.value,
                },
            },
        });

        this.formsService.UpdateValuesReference({
            Id: this.formName,
            Form: this.Form,
        });
    }

    /**
     * Reset form controls back to previous values
     */
    protected resetForm(): void {
        // enable all forms
        // this.formsService.DisableForms(false);

        this.formsService.ResetFormValues(this.formName);
    }

    /**
     * Listen to form changes
     */
    protected onChange(): void {
        this.Form.valueChanges.subscribe((val: object) => {
            if (this.formsService.ForRealThough(this.formName, this.Form)) {
                this.IsDirty = true;
                // disable all forms except the current form being edited
                this.formsService.DisableForms(this.formName);
            } else {
                this.IsDirty = false;
                // enable all forms
                this.formsService.DisableForms(false);
            }
        });
    }
}
