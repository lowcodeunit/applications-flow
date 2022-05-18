import { Injectable } from '@angular/core';
import { BaseModeledResponse, BaseResponse, Status } from '@lcu/common';
import { EaCApplicationAsCode, EnterpriseAsCode } from '@semanticjs/common';
import {
    ApplicationsFlowState,
    LicenseAndBillingResponse,
    UnpackLowCodeUnitRequest,
} from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';
import {
    FeedEntry,
    FeedItem,
    UserFeedResponse,
} from '../models/user-feed.model';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    public CreatingProject: boolean;

    public EditingProjectLookup: string;

    constructor(
        protected appsFlowSvc: ApplicationsFlowService,
        protected activatedRoute: ActivatedRoute
    ) {}

    // public CreateRepository(state: ApplicationsFlowState, org: string, repoName: string): void {
    //   state.GitHub.Loading = true;

    //   this.appsFlowSvc
    //     .CreateRepository(org, repoName)
    //     .subscribe((response: BaseResponse) => {
    //       if (response.Status.Code === 0) {
    //         this.listRepositories(repoName);

    //         state.GitHub.CreatingRepository = false;
    //       } else {
    //         //  TODO:  Need to surface an error to the user...

    //         state.GitHub.Loading = false;
    //       }
    //     });
    // }

    public EnsureUserEnterprise(
        state: ApplicationsFlowState
    ): Promise<BaseResponse> {
        return new Promise((resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.EnsureUserEnterprise().subscribe(
                async (response: BaseResponse) => {
                    if (response.Status.Code === 0) {
                        // const eac = await this.LoadEnterpriseAsCode(state);

                        resolve(response);
                    } else {
                        state.Loading = false;

                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public async EnterpriseAsCodeRemovals(
        state: ApplicationsFlowState,
        eac: EnterpriseAsCode
    ): Promise<Status> {
        return new Promise((resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.EnterpriseAsCodeRemovals(eac).subscribe(
                async (response: BaseModeledResponse<string>) => {
                    if (response.Status.Code === 0) {
                        resolve(response.Status);

                        var results = await Promise.all([
                            this.LoadEnterpriseAsCode(state),
                            this.LoadUserFeed(1, 25, false, state),
                        ]);
                    } else {
                        state.Loading = false;

                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public GenerateRoutedApplications(
        applications: { [lookup: string]: EaCApplicationAsCode },
        state: ApplicationsFlowState
    ): {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    } {
        const appLookups = Object.keys(applications);

        const apps = appLookups.map((appLookup) => applications[appLookup]);

        let appRoutes =
            apps.map((app) => {
                return app?.LookupConfig?.PathRegex.replace('.*', '');
            }) || [];

        appRoutes = appRoutes.filter((ar) => ar != null);

        let routeBases: string[] = [];

        appRoutes.forEach((appRoute) => {
            const appRouteParts = appRoute.split('/');

            const appRouteBase = `/${appRouteParts[1]}`;

            if (routeBases.indexOf(appRouteBase) < 0) {
                routeBases.push(appRouteBase);
            }
        });

        let workingAppLookups = [...(appLookups || [])];

        routeBases = routeBases.sort((a, b) => b.localeCompare(a));

        const routeSet =
            routeBases.reduce((prevRouteMap, currentRouteBase) => {
                const routeMap = {
                    ...prevRouteMap,
                };

                const filteredAppLookups = workingAppLookups.filter((wal) => {
                    const wa = applications[wal];

                    return wa?.LookupConfig?.PathRegex.startsWith(
                        currentRouteBase
                    );
                });

                routeMap[currentRouteBase] =
                    filteredAppLookups.reduce((prevAppMap, appLookup) => {
                        const appMap = {
                            ...prevAppMap,
                        };

                        appMap[appLookup] = applications[appLookup];

                        return appMap;
                    }, {}) || {};

                workingAppLookups = workingAppLookups.filter((wa) => {
                    return filteredAppLookups.indexOf(wa) < 0;
                });

                return routeMap;
            }, {}) || {};

        let routeSetKeys = Object.keys(routeSet);

        routeSetKeys = routeSetKeys.sort((a, b) => a.localeCompare(b));

        const routeSetResult = {};

        routeSetKeys.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

        return routeSetResult;
    }

    public async GetActiveEnterprise(
        state: ApplicationsFlowState
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            state.LoadingActiveEnterprise = true;

            this.appsFlowSvc.GetActiveEnterprise().subscribe(
                async (
                    response: BaseModeledResponse<{
                        Name: string;
                        Lookup: string;
                    }>
                ) => {
                    state.LoadingActiveEnterprise = false;

                    if (response.Status.Code === 0) {
                        state.ActiveEnterpriseLookup = response.Model?.Lookup;

                        resolve();
                    } else {
                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.LoadingActiveEnterprise = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public HasValidConnection(
        state: ApplicationsFlowState,
        forceEnsureUser: boolean = false
    ): Promise<EnterpriseAsCode> {
        return new Promise(async (resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.HasValidConnection().subscribe(
                async (response: BaseResponse) => {
                    state.GitHub.HasConnection = response.Status.Code === 0;

                    if (state.GitHub.HasConnection || forceEnsureUser) {
                    } else {
                    }

                    resolve({});
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public async ListEnterprises(state: ApplicationsFlowState): Promise<any[]> {
        return new Promise((resolve, reject) => {
            state.LoadingEnterprises = true;

            this.appsFlowSvc.ListEnterprises().subscribe(
                async (response: BaseModeledResponse<Array<any>>) => {
                    state.LoadingEnterprises = false;

                    if (response.Status.Code === 0) {
                        state.Enterprises = response.Model;

                        resolve(response.Model);
                    } else {
                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.LoadingEnterprises = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public LoadEnterpriseAsCode(
        state: ApplicationsFlowState
    ): Promise<EnterpriseAsCode> {
        return new Promise((resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.LoadEnterpriseAsCode().subscribe(
                (response: BaseModeledResponse<EnterpriseAsCode>) => {
                    state.Loading = false;

                    if (response.Status.Code === 0) {
                        state.EaC = response.Model || {};
                    } else if (response.Status.Code === 3) {
                    }

                    state.EaC = state.EaC || {};

                    this.CreatingProject =
                        Object.keys(state?.EaC?.Projects || {}).length <= 0;

                    resolve(state.EaC);

                    this.activatedRoute.queryParams.subscribe((params) => {
                        if (params?.direct == 'true') {
                            let projKeys = Object.keys(
                                state.EaC.Projects || {}
                            );

                            if (projKeys.length == 1) {
                                console.log('Directing to deeper link');

                                let appKeys = Object.keys(
                                    state.EaC.Applications || {}
                                );

                                if (appKeys.length == 1) {
                                    let app =
                                        state.EaC.Applications[appKeys[0]];

                                    let routeKey = encodeURIComponent(
                                        app.LookupConfig.PathRegex?.replace(
                                            '.*',
                                            ''
                                        ) || '/'
                                    );

                                    window.location.href = `/dashboard/application/${appKeys[0]}/${routeKey}/${projKeys[0]}`;
                                } else {
                                    window.location.href = `/dashboard/project/${projKeys[0]}`;
                                }
                            }
                        }
                    });

                    console.log(state);
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public async LoadUserFeed(
        page: number,
        pageSize: number,
        forCheck: boolean = false,
        state: ApplicationsFlowState
    ): Promise<Array<FeedItem>> {
        return new Promise((resolve, reject) => {
            state.LoadingFeed = !forCheck;

            let paramMap = this.activatedRoute.snapshot.children[0].paramMap;

            let result = this.loadApplicationsForFeed(state, paramMap);

            this.appsFlowSvc
                .LoadUserFeed(
                    page,
                    pageSize,
                    result?.Project,
                    result?.Applications
                )
                .subscribe(
                    async (response: UserFeedResponse) => {
                        state.LoadingFeed = false;

                        if (response.Status.Code === 0) {
                            if (!forCheck) {
                                state.Feed = response.Items;

                                state.FeedSourceControlLookups =
                                    response.SourceControlLookups;

                                state.FeedActions = response.Actions;

                                state.FeedCheck = null;
                            } else {
                                let items = response.Items?.filter(
                                    (i) =>
                                        !state.Feed?.find((f) => f.ID == i.ID)
                                );

                                if (items?.length > 0) {
                                    state.FeedCheck = response;
                                }
                            }
                            // console.log("ITEMZ: ", response.Items)

                            resolve(response.Items);
                        } else {
                            reject(response.Status);
                        }
                    },
                    (err) => {
                        state.LoadingFeed = false;

                        reject(err);

                        console.log(err);
                    }
                );
        });
    }

    public async LoadUserLicenseInfo(state: ApplicationsFlowState) {
        this.appsFlowSvc.LoadLicenseData().subscribe(async (response: any) => {
            state.LoadingFeed = false;
            if (response.Status.Code === 0) {
                state.UserLicenseInfo = response.Model;
            } else {
                console.error(
                    'Error loading user information: ',
                    response.Status.Message
                );
            }
        });
    }

    public async SetActiveEnterprise(
        state: ApplicationsFlowState,
        activeEntLookup: string
    ): Promise<Status> {
        return new Promise((resolve, reject) => {
            state.Loading = true;
            state.LoadingFeed = true;

            this.appsFlowSvc.SetActiveEnterprise(activeEntLookup).subscribe(
                async (response: BaseResponse) => {
                    if (response.Status.Code === 0) {
                        this.EditingProjectLookup = null;

                        console.log(
                            'project service active ent: ',
                            activeEntLookup
                        );

                        state.ActiveEnterpriseLookup = activeEntLookup;

                        console.log(
                            'project service State active ent: ',
                            state.ActiveEnterpriseLookup
                        );

                        resolve(response.Status);

                        var results = await Promise.all([
                            this.LoadEnterpriseAsCode(state),
                            this.LoadUserFeed(1, 25, false, state),
                        ]);
                    } else {
                        state.Loading = false;

                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public async SaveEnterpriseAsCode(
        state: ApplicationsFlowState,
        eac: EnterpriseAsCode
    ): Promise<Status> {
        return new Promise((resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.SaveEnterpriseAsCode(eac).subscribe(
                async (response: BaseModeledResponse<string>) => {
                    if (response.Status.Code === 0) {
                        resolve(response.Status);

                        var results = await Promise.all([
                            this.LoadEnterpriseAsCode(state),
                            this.LoadUserFeed(1, 25, false, state),
                        ]);
                    } else {
                        state.Loading = false;

                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public SetCreatingProject(creatingProject: boolean): void {
        this.CreatingProject = creatingProject;

        this.EditingProjectLookup = null;
    }

    public SetEditProjectSettings(
        state: ApplicationsFlowState,
        projectLookup: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            if (projectLookup != null) {
                state.Loading = false;

                this.EditingProjectLookup = null;

                setTimeout(() => {
                    this.EditingProjectLookup = projectLookup;

                    resolve({});
                }, 0);

                this.CreatingProject = false;

                console.log(state);
            } else {
                state.Loading = false;

                this.EditingProjectLookup = projectLookup;

                this.CreatingProject = false;

                resolve({});
            }
        });
    }

    public async SubmitFeedEntry(
        state: ApplicationsFlowState,
        entry: FeedEntry
    ): Promise<Status> {
        return new Promise((resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.SubmitFeedEntry(entry).subscribe(
                async (response: BaseModeledResponse<string>) => {
                    if (response.Status.Code === 0) {
                        resolve(response.Status);

                        var results = await Promise.all([
                            this.LoadEnterpriseAsCode(state),
                            this.LoadUserFeed(1, 25, false, state),
                        ]);
                    } else {
                        state.Loading = false;

                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    public ToggleCreateProject(): void {
        this.SetCreatingProject(!this.CreatingProject);
    }

    public UnpackLowCodeUnit(
        state: ApplicationsFlowState,
        req: UnpackLowCodeUnitRequest
    ): Promise<Status> {
        return new Promise((resolve, reject) => {
            state.Loading = true;

            this.appsFlowSvc.UnpackLowCodeUnit(req).subscribe(
                async (response: BaseResponse) => {
                    if (response.Status.Code === 0) {
                        resolve(response.Status);

                        var results = await Promise.all([
                            this.LoadEnterpriseAsCode(state),
                            this.LoadUserFeed(1, 25, false, state),
                        ]);
                    } else {
                        state.Loading = false;

                        reject(response.Status);

                        console.log(response);
                    }
                },
                (err) => {
                    state.Loading = false;

                    reject(err);

                    console.log(err);
                }
            );
        });
    }

    //  Helpers
    protected loadApplicationsForFeed(
        state: ApplicationsFlowState,
        paramMap: any
    ) {
        // this.activatedRoute.paramMap.subscribe(async (paramMap) => {
        var project = paramMap.get('projectLookup') || '';

        var route = paramMap.get('appRoute');

        var application = paramMap.get('appLookup');

        var applications: string[] = [];

        if (application) {
            applications.push(application);
        } else if (route && project) {
            const apps: { [lookup: string]: EaCApplicationAsCode } = {};

            state.EaC?.Projects[project].ApplicationLookups.forEach(
                (appLookup: string) => {
                    apps[appLookup] = state.EaC.Applications[appLookup];
                }
            );

            var routedApps = this.GenerateRoutedApplications(apps, state);

            var currentApps = routedApps[route];

            applications = Object.keys(currentApps) || [];
        }

        return {
            Applications: applications,
            Project: project,
        };
        // });
    }
}
