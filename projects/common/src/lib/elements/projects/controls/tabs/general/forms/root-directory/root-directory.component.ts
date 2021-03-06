import { Subscription } from 'rxjs';
import { FormsService } from './../../../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../../../models/card-form-config.model';
import { Component, Input, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { EaCService } from '../../../../../../../services/eac.service';
import { EaCProjectAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-root-directory',
    templateUrl: './root-directory.component.html',
    styleUrls: ['./root-directory.component.scss'],
})
export class RootDirectoryComponent implements OnInit {
    /**
     * Card / Form Config
     */
    public Config: CardFormConfigModel;

    /**
     * FormGroup
     */
    public Form: FormGroup;

    protected formIsDirtySubscription: Subscription;

    /**
     * Access form control for root directory
     */
    public get Root(): AbstractControl {
        return this.Form.get('root');
    }

    /**
     * Access form control for root directory
     */
    public get IncludeSource(): AbstractControl {
        return this.Form.get('includeSource');
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
        this.setupForm();

        this.config();
    }

    /**
     * Setup form controls
     */
    protected setupForm(): void {
        this.Form = new FormGroup({
            root: new FormControl('/', {
                validators: [Validators.required, Validators.minLength(1)],
                updateOn: 'change',
            }),
            includeSource: new FormControl(false),
        });

        this.formsService.Form = { Id: 'RootDirectoryForm', Form: this.Form };
        this.onChange();
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
                        Label: 'Clear',
                        Color: 'warn',
                        ClickEvent: () => this.clearForm(),
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
     * Save form
     */
    protected save(): void {
        this.eacSvc.SaveProjectAsCode({
            ProjectLookup: this.ProjectLookup,
            Project: {
                ...this.Project,
                // Root: this.Root.value,
                // IncludeSource: this.IncludeSource.value
            },
        });
        // this.formsService.UpdateValuesReference({ Id: 'RootDirectoryForm', Form: this.Form });
    }

    /**
     * Clear form controls
     */
    protected clearForm(): void {
        // this.Form.reset();

        // enable all forms
        this.formsService.DisableForms(false);
    }

    /**
     * Listen to form changes
     */
    protected onChange(): void {
        this.Form.valueChanges.subscribe((val: any) => {
            // disable all forms except the current form being edited
            this.formsService.DisableForms('RootDirectoryForm');
        });
    }
}
