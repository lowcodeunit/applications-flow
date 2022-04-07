import { Component, Input, OnInit } from '@angular/core';
import { EaCService } from './../../../../services/eac.service';
import { EaCProjectAsCode } from '@semanticjs/common';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Guid, LCUServiceSettings } from '@lcu/common';

@Component({
    selector: 'lcu-projects-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    //  Fields

    //  Properties
    @Input('creating-project')
    public CreatingProject: boolean;

    public get HasProjects(): boolean {
        return this.ProjectLookups && this.ProjectLookups.length > 0;
    }

    public ProjectFormGroup: FormGroup;

    public get ProjectLookups(): Array<string> {
        return Object.keys(this.Projects || {});
    }

    public get ProjectName(): AbstractControl {
        return this.ProjectFormGroup.get('name');
    }

    @Input('projects')
    public Projects: { [lookup: string]: EaCProjectAsCode };

    @Input('selected-project-lookup')
    public SelectedProjectLookup: string;

    //  Constructors
    public constructor(
        protected formBuilder: FormBuilder,
        protected lcuSettings: LCUServiceSettings,
        protected eacSvc: EaCService
    ) {}

    //  Life Cycle
    public ngOnInit(): void {
        this.ProjectFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
        });
    }

    //  API Methods
    public CreateProject(): void {
        const proj: EaCProjectAsCode = {
            Project: {
                Name: this.ProjectName?.value,
            },
            Hosts: [`${Guid.CreateRaw()}-shared.fathym-it.com`],
            ModifierLookups: ['html-base', 'lcu-reg'],
            RelyingParty: {
                AccessConfigurations: {
                    fathym: {
                        AccessRightLookups: [
                            'Fathym.Global.Admin',
                            'Fathym.User',
                        ],
                        ProviderLookups: ['ADB2C'],
                        Usernames: [
                            'support@fathym.com',
                            this.lcuSettings.User.Email,
                        ],
                    },
                },
                AccessRightLookups: ['Fathym.Global.Admin', 'Fathym.User'],
                DefaultAccessConfigurationLookup: 'fathym',
                TrustedProviderLookups: ['ADB2C'],
            },
        };

        this.eacSvc.SaveProjectAsCode({
            ProjectLookup: Guid.CreateRaw(),
            Project: proj,
        });
    }

    public EnableCreatingProject(): void {
        this.eacSvc.SetCreatingProject(true);
    }

    //  Helpers
}
