import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
export class DomainsComponent implements OnInit, OnChanges {
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

    public Host: EaCHost;

    /**
     * When form is dirty, ties into formsService.DisableForms
     */
    public IsDirty: boolean;

    public HostDNSInstance: string;

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

    constructor(
        protected formsService: FormsService,
        protected eacSvc: EaCService
    ) {
        this.Form = new FormGroup({});
    }

    public ngOnInit(): void {
        this.formName = 'DomainForm';
    }

    public ngOnChanges() {
        if (this.Data?.Hosts && this.Data?.PrimaryHost) {
            this.Host = this.Data?.Hosts[this.Data?.PrimaryHost];
        }
        this.HostDNSInstance = this.Host ? this.Host?.HostDNSInstance : null;

        console.log('data from domains: ', this.Data);

        // console.log('hello primary host: ', this.Data?.PrimaryHost)

        if (this.Data?.PrimaryHost) {
            this.setupForm();
        }
        if (this.HostDNSInstance) {
            this.config();
        }
        console.log('CONFIG: ', this.Config);
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
        // console.log("p-host: ", this.Data?.PrimaryHost)
        this.Form = new FormGroup({
            domain: new FormControl(this.Data?.PrimaryHost || '', {
                validators: [Validators.required, Validators.minLength(3)],
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
        this.eacSvc.SaveProjectAsCode({
            ProjectLookup: this.Data?.ProjectLookup,
            Project: {
                ...this.Data?.Project,
                // Hosts: [...this.Project.Hosts, this.Domain.value],
                Hosts: [this.Domain.value],
            },
        });
        this.formsService.UpdateValuesReference({
            Id: this.formName,
            Form: this.Form,
        });
    }
}
