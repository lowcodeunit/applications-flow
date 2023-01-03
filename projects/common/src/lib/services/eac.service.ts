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
import { BaseResponse, Status } from '@lcu/common';
import { BehaviorSubject, Observable } from 'rxjs';

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
    //Fields
    protected stateSubject: BehaviorSubject<ApplicationsFlowState>;

    //  Properties
    public get EditingProjectLookup(): string {
        return this.projectService.EditingProjectLookup;
    }

    public get CreatingProject(): boolean {
        return this.projectService.CreatingProject;
    }

    public State: Observable<ApplicationsFlowState>;

    //  Constructors
    constructor(
        protected projectService: ProjectService,
        protected http: HttpClient
    ) {
        this.stateSubject = new BehaviorSubject(new ApplicationsFlowState());
        this.State = this.stateSubject.asObservable();
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
            const state = this.stateSubject.getValue();
            const eac: EnterpriseAsCode = {
                EnterpriseLookup: state.EaC.EnterpriseLookup,
                Applications: {},
            };

            eac.Applications[appLookup] = {
                Application: {},
            };

            const status = await this.projectService.EnterpriseAsCodeRemovals(
                state,
                eac
            );
            this.stateSubject.next(state);
            return status;
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
            const state = this.stateSubject.getValue();

            const eac: EnterpriseAsCode = {
                EnterpriseLookup: state.EaC.EnterpriseLookup,
                Environments: {},
            };

            eac.Environments[state.EaC.Enterprise.PrimaryEnvironment] = {
                DevOpsActions: {},
            };

            eac.Environments[
                state.EaC.Enterprise.PrimaryEnvironment
            ].DevOpsActions[doaLookup] = {};

            const status = await this.projectService.EnterpriseAsCodeRemovals(
                state,
                eac
            );
            this.stateSubject.next(state);
            return status;
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
            const state = this.stateSubject.getValue();

            const eac: EnterpriseAsCode = {
                EnterpriseLookup: state.EaC.EnterpriseLookup,
                Modifiers: {},
            };

            eac.Modifiers[modifierLookup] = {};

            const status = await this.projectService.EnterpriseAsCodeRemovals(
                state,
                eac
            );
            this.stateSubject.next(state);
            return status;
        }
    }

    public async DeleteProject(
        projectLookup: string,
        projectName: string
    ): Promise<Status> {
        if (
            confirm(`Are you sure you want to delete Project '${projectName}'?`)
        ) {
            const state = this.stateSubject.getValue();

            const eac: EnterpriseAsCode = {
                EnterpriseLookup: state.EaC.EnterpriseLookup,
                Projects: {},
            };

            eac.Projects[projectLookup] = {
                Project: {},
            };

            const status = await this.projectService.EnterpriseAsCodeRemovals(
                state,
                eac
            );

            this.stateSubject.next(state);
            return status;
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
            const state = this.stateSubject.getValue();

            const eac: EnterpriseAsCode = {
                EnterpriseLookup: state.EaC.EnterpriseLookup,
                Environments: {},
            };

            eac.Environments[state.EaC.Enterprise.PrimaryEnvironment] = {
                Sources: {},
            };

            eac.Environments[state.EaC.Enterprise.PrimaryEnvironment].Sources[
                srcLookup
            ] = {};

            const status = await this.projectService.EnterpriseAsCodeRemovals(
                state,
                eac
            );

            this.stateSubject.next(state);
            return status;
        }
    }

    // this.appsFlowEventsSvc.EnsureUserEnterpriseEvent.subscribe(async () => {
    //   await this.projectService.EnsureUserEnterprise(this.State);
    // });

    public async EnsureUserEnterprise(): Promise<BaseResponse> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.EnsureUserEnterprise(state);
        this.stateSubject.next(state);
        return status;
    }

    public async EnterpriseAsCodeRemovals(
        eac: EnterpriseAsCode
    ): Promise<Status> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.EnterpriseAsCodeRemovals(
            state,
            eac
        );

        this.stateSubject.next(state);
        return status;
    }

    public async GetActiveEnterprise(): Promise<void> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.GetActiveEnterprise(state);

        this.stateSubject.next(state);
        return status;
    }

    public async LoadUserFeed(
        page: number,
        pageSize: number,
        forCheck: boolean = false,
        filterStr: string = ''
    ): Promise<Array<FeedItem>> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.LoadUserFeed(
            page,
            pageSize,
            filterStr,
            forCheck,
            state
        );

        this.stateSubject.next(state);
        return status;
    }

    public GenerateRoutedApplications(applications: {
        [lookup: string]: EaCApplicationAsCode;
    }): {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    } {
        const state = this.stateSubject.getValue();

        const status = this.projectService.GenerateRoutedApplications(
            applications,
            state
        );
        this.stateSubject.next(state);
        return status;
    }

    public async HasValidConnection(): Promise<EnterpriseAsCode> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.HasValidConnection(state);

        this.stateSubject.next(state);
        return status;
    }

    public async ListEnterprises(): Promise<Array<any>> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.ListEnterprises(state);

        this.stateSubject.next(state);
        return status;
    }

    public async LoadEnterpriseAsCode(): Promise<EnterpriseAsCode> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.LoadEnterpriseAsCode(state);

        this.stateSubject.next(state);
        return status;
    }

    public async LoadUserInfo(): Promise<void> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.LoadUserLicenseInfo(state);
        this.stateSubject.next(state);
        return status;
    }

    public ReloadFeed() {
        const state = this.stateSubject.getValue();

        if (state.FeedCheck) {
            state.Feed = state.FeedCheck.Items;

            state.FeedActions = state.FeedCheck.Actions;

            state.FeedSourceControlLookups =
                state.FeedCheck.SourceControlLookups;
        }

        state.FeedCheck = null;

        this.stateSubject.next(state);
        return state;
    }

    public async SaveApplicationAsCode(
        req: SaveApplicationAsCodeEventRequest
    ): Promise<Status> {
        return await this.handleSaveApplication(req);
    }

    public async SaveDFSModifier(
        req: SaveDFSModifierEventRequest
    ): Promise<Status> {
        return await this.handleSaveDFSModifier(req);
    }

    public async SaveEnterpriseAsCode(eac: EnterpriseAsCode): Promise<Status> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.SaveEnterpriseAsCode(
            state,
            eac
        );
        this.stateSubject.next(state);
        return status;
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

    public async SetActiveEnterprise(entLookup: any): Promise<Status> {
        const state = this.stateSubject.getValue();

        const status = this.projectService.SetActiveEnterprise(
            state,
            entLookup
        );

        this.stateSubject.next(state);
        return status;
    }

    public async SetCreatingProject(creatingProject: boolean): Promise<void> {
        const state = this.stateSubject.getValue();

        const status = this.projectService.SetCreatingProject(creatingProject);
        this.stateSubject.next(state);
        return status;
    }

    public async SetEditProjectSettings(projectLookup: string): Promise<void> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.SetEditProjectSettings(
            state,
            projectLookup
        );

        this.stateSubject.next(state);
        return status;
    }

    public async SubmitFeedEntry(entry: FeedEntry): Promise<Status> {
        const state = this.stateSubject.getValue();

        const status = await this.projectService.SubmitFeedEntry(state, entry);

        this.stateSubject.next(state);
        return status;
    }

    public async UnpackLowCodeUnit(
        req: UnpackLowCodeUnitRequest
    ): Promise<Status> {
        if (
            confirm(
                `Are you sure you want to unpack application '${req.ApplicationName}' with version '${req.Version}'?`
            )
        ) {
            const state = this.stateSubject.getValue();

            const status = await this.projectService.UnpackLowCodeUnit(
                state,
                req
            );

            this.stateSubject.next(state);
            return status;
        }
    }

    //  Helpers
    protected async handleSaveApplication(
        req: SaveApplicationAsCodeEventRequest
    ): Promise<Status> {
        const state = this.stateSubject.getValue();

        // console.log("app req: ", req);

        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: state.EaC.EnterpriseLookup,
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

        const status = await this.projectService.SaveEnterpriseAsCode(
            state,
            saveEaC
        );

        this.stateSubject.next(state);
        return status;
    }

    protected async handleSaveDFSModifier(
        req: SaveDFSModifierEventRequest
    ): Promise<Status> {
        const state = this.stateSubject.getValue();

        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: state.EaC.EnterpriseLookup,
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
            // console.log('APPLOokup: ', req.ApplicationLookup);
            saveEaC.Applications[req.ApplicationLookup] = {
                ModifierLookups: req.ModifierLookups,
            };
        }

        console.log('Save mod eac: ', saveEaC);

        const status = await this.projectService.SaveEnterpriseAsCode(
            state,
            saveEaC
        );

        this.stateSubject.next(state);
        return status;
    }

    protected async handleSaveEnvironment(
        req: SaveEnvironmentAsCodeEventRequest
    ): Promise<Status> {
        const state = this.stateSubject.getValue();

        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: state?.EaC?.EnterpriseLookup,
            DataTokens: {},
            Environments: {},
        };

        if (req.Environment) {
            saveEaC.Environments[req.EnvironmentLookup] = req.Environment;
        }

        if (req.EnterpriseDataTokens) {
            saveEaC.DataTokens = req.EnterpriseDataTokens;
        }

        const status = await this.projectService.SaveEnterpriseAsCode(
            state,
            saveEaC
        );

        this.stateSubject.next(state);
        return status;
    }

    protected async handleSaveProject(
        projectLookup: string,
        project: EaCProjectAsCode
    ): Promise<Status> {
        const projHosts: { [lookup: string]: EaCHost } = {};

        const state = this.stateSubject.getValue();

        project?.Hosts?.forEach((host: any) => {
            projHosts[host] = state.EaC.Hosts[host];
        });

        const saveEaC: EnterpriseAsCode = {
            EnterpriseLookup: state.EaC.EnterpriseLookup,
            Enterprise: {
                ...state.EaC.Enterprise,
                PrimaryHost: project.PrimaryHost,
            },
            Hosts: projHosts,
            // Providers: state.EaC.Providers,  //  TODO:  Remove after all providers ADB2C's have been upgraded
            Projects: {},
        };

        saveEaC.Projects[projectLookup] = project;

        // console.log('save eac request: ', saveEaC);

        let status = await this.projectService.SaveEnterpriseAsCode(
            state,
            saveEaC
        );

        this.SetEditProjectSettings(projectLookup);

        this.stateSubject.next(state);
        return status;
    }
}
