import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { EaCService } from '../../../../../services/eac.service';
import { EaCHost, EaCProjectAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-domains',
    templateUrl: './domains.component.html',
    styleUrls: ['./domains.component.scss'],
})
export class DomainsComponent implements OnInit {
    /**
     * Card / Form Config
     */
    public Config: CardFormConfigModel;

    /**
     * FormGroup
     */
    public Form: FormGroup;

    /**
     * Form name
     */
    protected formName: string;

    /**
     * When form is dirty, ties into formsService.DisableForms
     */
    public IsDirty: boolean;

    /**
     * Access form control for root directory
     */
    public get Domain(): AbstractControl {
        return this.Form.get('domain');
    }

    @Input('data')
    public Data: {
        Hosts: { [lookup: string]: EaCHost };
        PrimaryHost: string;
        Project: EaCProjectAsCode;
        ProjectLookup: string;
    };

    @Output('result-event')
    public ResultEvent: EventEmitter<any>;

    public get Host(): EaCHost {
        return this.Data?.Hosts[this.HostLookup];
    }

    public get HostLookup(): string {
        // let hostKeys = Object.keys(this.Data?.Hosts || {});

        // hostKeys = hostKeys.filter(hk => hk.indexOf('|') < 0);

        // return hostKeys[0];
        return this.PrimaryHost;
    }

    public get HostDNSInstance(): string {
        return this.Host ? this.Host?.HostDNSInstance : null;
    }

    public get PrimaryHost(): string {
        return this.Data.PrimaryHost;
    }

    public get Project(): EaCProjectAsCode {
        return this.Data.Project;
    }

    public get ProjectLookup(): string {
        return this.Data.ProjectLookup;
    }

    public Error: string;

    constructor(
        protected formsService: FormsService,
        protected eacSvc: EaCService
    ) {
        this.ResultEvent = new EventEmitter();
        this.Error = '';
    }

    public ngOnInit(): void {
        this.formName = 'DomainForm';

        this.setupForm();

        this.config();
    }

    protected config(): void {
        this.Config = new CardFormConfigModel({
            Icon: 'head',
            Title: '',
            Subtitle:
                'In order to use a custom domain, create a CNAME dns record pointing desired subdomain to ' +
                this.HostDNSInstance +
                '.',
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

    protected setupForm(): void {
        const regEx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.Form = new FormGroup({
            domain: new FormControl(this.HostLookup || '', {
                validators: [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.pattern(regEx),
                ],
                updateOn: 'change',
            }),
        });

        this.formsService.Form = { Id: this.formName, Form: this.Form };
        this.onChange();
    }

    protected onChange(): void {
        this.Form.valueChanges.subscribe((val: any) => {
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

    /**
     * Reset form controls back to previous values
     */
    protected resetForm(): void {
        // enable all forms
        // this.formsService.DisableForms(false);

        this.formsService.ResetFormValues(this.formName);
    }

    /**
     * Save changes
     */
    protected save(): void {
        this.eacSvc
            .SaveProjectAsCode({
                ProjectLookup: this.ProjectLookup,
                Project: {
                    ...this.Project,
                    // Hosts: [...this.Project.Hosts, this.Domain.value],
                    Hosts: [this.Domain.value],
                },
            })
            .then((result) => {
                console.log('domain result: ', result);
                if (result.Code != 0) {
                    this.Error = result.Message;
                } else {
                    this.ResultEvent.emit(result);
                }
            });
        this.formsService.UpdateValuesReference({
            Id: this.formName,
            Form: this.Form,
        });
    }
}
