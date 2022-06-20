import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import {
    ApplicationsFlowState,
    UnpackLowCodeUnitRequest,
} from '../state/applications-flow.state';
import {
    EaCApplicationAsCode,
    EaCDataToken,
    EaCDFSModifier,
    EaCEnvironmentAsCode,
    EaCHost,
    EaCProjectAsCode,
    EnterpriseAsCode,
} from '@semanticjs/common';
import { FeedEntry, FeedItem } from '../models/user-feed.model';
import { HttpClient } from '@angular/common/http';
import { Status } from '@lcu/common';
import { Observable } from 'rxjs';

export class SaveApplicationAsCodeEventRequest {
    public Application?: EaCApplicationAsCode;

    public ApplicationLookup?: string;

    public ProjectLookup?: string;
}

export class SaveDFSModifierEventRequest {
    public ApplicationLookup?: string;

    public Modifier?: EaCDFSModifier;

    public ModifierLookups?: Array<string>;

    public ProjectLookups?: Array<string>;
}

export class SaveEnvironmentAsCodeEventRequest {
    public EnterpriseDataTokens?: { [lookup: string]: EaCDataToken };

    public Environment?: EaCEnvironmentAsCode;

    public EnvironmentLookup?: string;
}

export class SaveProjectAsCodeEventRequest {
    public Project?: EaCProjectAsCode;

    public ProjectLookup?: string;
}

@Injectable({
    providedIn: 'root',
})
export class EaCService {
    //  Properties
    public get EditingProjectLookup(): string {
        return this.projectService.EditingProjectLookup;
    }

    public get CreatingProject(): boolean {
        return this.projectService.CreatingProject;
    }

    public State: ApplicationsFlowState;

    //  Constructors
    constructor(
        protected projectService: ProjectService,
        protected http: HttpClient
    ) {
        this.State = new ApplicationsFlowState();
    }

    //  API Methods
    public CheckUserFeedItem(feedItem: FeedItem): Observable<object> {
        return this.http.get(feedItem.RefreshLink);
    }

    public async DeleteApplication(
        appLookup: string,
        appName: string
    ): Promise<Status> {
        if (
            confirm(`Are you sure you want to delete application '${appName}'?`)
        ) {
            const eac: EnterpriseAsCode = {
                EnterpriseLookup: this.State.EaC.EnterpriseLookup,
                Applications: {},
            };

            eac.Applications[appLookup] = {
                Application: {},
            };

            return await this.projectService.EnterpriseAsCodeRemovals(
                this.State,
                eac
            );
        }
    }

    public async DeleteDevOpsAction(
        doaLookup: string,
        doaName: string
    ): Promise<Status> {
        if (
            confirm(
                `Are you sure you want to delete Build Pipeline '${doaName}'?`
            )
        ) {
            const eac: EnterpriseAsCode = {
                EnterpriseLookup: this.State.EaC.EnterpriseLookup,
                Environments: {},
            };

            eac.Environments[this.State.EaC.Enterprise.PrimaryEnvironment] = {
                DevOpsActions: {},
            };

            eac.Environments[
                this.State.EaC.Enterprise.PrimaryEnvironment
            ].DevOpsActions[doaLookup] = {};

            return await this.projectService.EnterpriseAsCodeRemovals(
                this.State,
                eac
            );
        }
    }

    public async DeleteModifier(
        modifierLookup: string,
        modifierName: string
    ): Promise<Status> {
        if (
            confirm(
                `Are you sure you want to delete Modifier '${modifierName}'?`
            )
        ) {
            const eac: EnterpriseAsCode = {
                EnterpriseLookup: this.State.EaC.EnterpriseLookup,
                Modifiers: {},
            };

            eac.Modifiers[modifierLookup] = {};

            return await this.projectService.EnterpriseAsCodeRemovals(
                this.State,
                eac
            );
        }
    }

    public async DeleteProject(
        projectLookup: string,
        projectName: string
    ): Promise<Status> {
        if (
            confirm(`Are you sure you want to delete Project '${projectName}'?`)
        ) {
            const eac: EnterpriseAsCode = {
                EnterpriseLookup: this.State.EaC.EnterpriseLookup,
                Projects: {},
            };

            eac.Projects[projectLookup] = {
                Project: {},
            };

            return await this.projectService.EnterpriseAsCodeRemovals(
                this.State,
                eac
            );
        }
    }

    public async DeleteSourceControl(
        srcLookup: string,
        srcName: string
    ): Promise<Status> {
        if (
            confirm(
                `Are you sure you want to delete Source Control '${srcName}'?`
            )
        ) {
            const eac: EnterpriseAsCode = {
                EnterpriseLookup: this.State.EaC.EnterpriseLookup,
                Environments: {},
            };

            eac.Environments[this.State.EaC.Enterprise.PrimaryEnvironment] = {
                Sources: {},
            };

            eac.Environments[
                this.State.EaC.Enterprise.PrimaryEnvironment
            ].Sources[srcLookup] = {};

            return await this.projectService.EnterpriseAsCodeRemovals(
                this.State,
                eac
            );
        }
    }

    // this.appsFlowEventsSvc.EnsureUserEnterpriseEvent.subscribe(async () => {
    //   await this.projectService.EnsureUserEnterprise(this.State);
    // });

    public async EnsureUserEnterprise(): Promise<void> {
        await this.projectService.EnsureUserEnterprise(this.State);
    }

    public async EnterpriseAsCodeRemovals(
        eac: EnterpriseAsCode
    ): Promise<Status> {
        return this.projectService.EnterpriseAsCodeRemovals(this.State, eac);
    }

    public async GetActiveEnterprise(): Promise<void> {
        await this.projectService.GetActiveEnterprise(this.State);
    }

    public async LoadUserFeed(
        page: number,
        pageSize: number,
        forCheck: boolean = false,
        filterStr: string = ''
    ): Promise<void> {
        await this.projectService.LoadUserFeed(
            page,
            pageSize,
            filterStr,
            forCheck,
            this.State
        );
    }

    public GenerateRoutedApplications(applications: {
        [lookup: string]: EaCApplicationAsCode;
    }): {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    } {
        return this.projectService.GenerateRoutedApplications(
            applications,
            this.State
        );
    }

    public async HasValidConnection(): Promise<void> {
        await this.projectService.HasValidConnection(this.State);
    }

    public async ListEnterprises(): Promise<void> {
        await this.projectService.ListEnterprises(this.State);
    }

    public async LoadEnterpriseAsCode(): Promise<void> {
        await this.projectService.LoadEnterpriseAsCode(this.State);
    }

    public async LoadUserInfo(): Promise<void> {
        await this.projectService.LoadUserLicenseInfo(this.State);
    }

    public ReloadFeed() {
        if (this.State.FeedCheck) {
            this.State.Feed = this.State.FeedCheck.Items;

            this.State.FeedActions = this.State.FeedCheck.Actions;

            this.State.FeedSourceControlLookups =
                this.State.FeedCheck.SourceControlLookups;
        }

        this.State.FeedCheck = null;
    }

    public async SaveApplicationAsCode(
        req: SaveApplicationAsCodeEventRequest
    ): Promise<Status> {
        return await this.handleSaveApplication(req);
    }

    public async SaveDFSModifier(
        req: SaveDFSModifierEventRequest
    ): Promise<void> {
        await this.handleSaveDFSModifier(req);
    }

    public async SaveEnterpriseAsCode(eac: EnterpriseAsCode): Promise<Status> {
        return await this.projectService.SaveEnterpriseAsCode(this.State, eac);
    }

    public async SaveEnvironmentAsCode(
        req: SaveEnvironmentAsCodeEventRequest
    ): Promise<Status> {
        return await this.handleSaveEnvironment(req);
    }

    public async SaveProjectAsCode(
        req: SaveProjectAsCodeEventRequest
    ): Promise<Status> {
        return await this.handleSaveProject(req.ProjectLookup, req.Project);
    }

    public async SetActiveEnterprise(entLookup: any): Promise<void> {
        this.projectService.SetActiveEnterprise(this.State, entLookup);
    }

    public async SetCreatingProject(creatingProject: boolean): Promise<void> {
        this.projectService.SetCreatingProject(creatingProject);
    }

    public async SetEditProjectSettings(projectLookup: string): Promise<void> {
        await this.projectService.SetEditProjectSettings(
            this.State,
            projectLookup
        );
    }

    public async SubmitFeedEntry(entry: FeedEntry): Promise<Status> {
        return await this.projectService.SubmitFeedEntry(this.State, entry);
    }

    public async UnpackLowCodeUnit(
        req: UnpackLowCodeUnitRequest
    ): Promise<void> {
        if (
            confirm(
                `Are you sure you want to unpack application '${req.ApplicationName}' with version '${req.Version}'?`
            )
        ) {
            await this.projectService.UnpackLowCodeUnit(this.State, req);
        }
    }

    //  Helpers
    protected async handleSaveApplication(
        req: SaveApplicationAsCodeEventRequest
    ): Promise<Status> {
        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: this.State.EaC.EnterpriseLookup,
            Applications: {},
            Projects: {},
        };

        if (req.ProjectLookup) {
            const existingProj = {
                [req.ProjectLookup]: {
                    ApplicationLookups: [req.ApplicationLookup],
                },
            };

            saveEaC.Projects = existingProj;
        }

        if (req.Application) {
            saveEaC.Applications[req.ApplicationLookup] = req.Application;
        }

        return await this.projectService.SaveEnterpriseAsCode(
            this.State,
            saveEaC
        );
    }

    protected async handleSaveDFSModifier(
        req: SaveDFSModifierEventRequest
    ): Promise<void> {
        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: this.State.EaC.EnterpriseLookup,
            Modifiers: {},
            Projects: {},
            Applications: {},
        };

        if (req.Modifier) {
            saveEaC.Modifiers[req.ModifierLookups[0]] = req.Modifier;
        }

        if (req.ProjectLookups) {
            req.ProjectLookups.forEach((lookup) => {
                saveEaC.Projects[lookup] = {
                    ModifierLookups: req.ModifierLookups,
                };
            });
        }

        if (req.ApplicationLookup) {
            console.log('APPLOokup: ', req.ApplicationLookup);
            console.log('saveEAC: ', saveEaC);
            saveEaC.Applications[req.ApplicationLookup] = {
                ModifierLookups: req.ModifierLookups,
            };
        }

        await this.projectService.SaveEnterpriseAsCode(this.State, saveEaC);
    }

    protected async handleSaveEnvironment(
        req: SaveEnvironmentAsCodeEventRequest
    ): Promise<Status> {
        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: this.State?.EaC?.EnterpriseLookup,
            DataTokens: {},
            Environments: {},
        };

        if (req.Environment) {
            saveEaC.Environments[req.EnvironmentLookup] = req.Environment;
        }

        if (req.EnterpriseDataTokens) {
            saveEaC.DataTokens = req.EnterpriseDataTokens;
        }

        return await this.projectService.SaveEnterpriseAsCode(
            this.State,
            saveEaC
        );
    }

    protected async handleSaveProject(
        projectLookup: string,
        project: EaCProjectAsCode
    ): Promise<Status> {
        const projHosts: { [lookup: string]: EaCHost } = {};

        project?.Hosts?.forEach((host: any) => {
            projHosts[host] = this.State.EaC.Hosts[host];
        });

        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: this.State.EaC.EnterpriseLookup,
            Enterprise: {
                ...this.State.EaC.Enterprise,
                PrimaryHost: project.Hosts[0],
            },
            Hosts: projHosts,
            // Providers: this.State.EaC.Providers,  //  TODO:  Remove after all providers ADB2C's have been upgraded
            Projects: {},
        };

        saveEaC.Projects[projectLookup] = project;

        let status = await this.projectService.SaveEnterpriseAsCode(
            this.State,
            saveEaC
        );

        this.SetEditProjectSettings(projectLookup);

        return status;
    }
}
