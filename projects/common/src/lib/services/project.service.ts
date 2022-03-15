import { Injectable } from '@angular/core';
import { BaseModeledResponse, BaseResponse, Status } from '@lcu/common';
import { debug } from 'console';
import { EaCApplicationAsCode, EaCProjectAsCode, EnterpriseAsCode } from '@semanticjs/common';
import {
  ApplicationsFlowState,
  GitHubWorkflowRun,
  UnpackLowCodeUnitRequest,
} from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';
import { FeedItem, UserFeedResponse } from '../models/user-feed.model';
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

  public async DeleteApplication(
    state: ApplicationsFlowState,
    appLookup: string
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.DeleteApplication(appLookup).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            const eac = await this.LoadEnterpriseAsCode(state);

            resolve(eac);
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

  public DeleteDevOpsAction(
    state: ApplicationsFlowState,
    doaLookup: string
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.DeleteDevOpsAction(doaLookup).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            const eac = await this.LoadEnterpriseAsCode(state);

            resolve(eac);
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

  public DeleteProject(
    state: ApplicationsFlowState,
    projectLookup: string
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.DeleteProject(projectLookup).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            const eac = await this.LoadEnterpriseAsCode(state);

            resolve(eac);
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

  public DeleteSourceControl(
    state: ApplicationsFlowState,
    scLookup: string
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.DeleteSourceControl(scLookup).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            const eac = await this.LoadEnterpriseAsCode(state);

            resolve(eac);
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

  public EnsureUserEnterprise(
    state: ApplicationsFlowState
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.EnsureUserEnterprise().subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            const eac = await this.LoadEnterpriseAsCode(state);

            resolve(eac);
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

  public GenerateRoutedApplications(applications: { [lookup: string]: EaCApplicationAsCode }, state: ApplicationsFlowState): {
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

          return wa?.LookupConfig?.PathRegex.startsWith(currentRouteBase);
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
          response: BaseModeledResponse<{ Name: string; Lookup: string }>
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
    state: ApplicationsFlowState
  ): Promise<Array<FeedItem>> {
    return new Promise((resolve, reject) => {
      state.LoadingFeed = true;

      let paramMap = this.activatedRoute.snapshot.children[0].paramMap;

      let result = this.loadApplicationsForFeed(state, paramMap);
  
      this.appsFlowSvc
        .LoadUserFeed(page, pageSize, result.Project, result.Applications)
        .subscribe(
          async (response: UserFeedResponse) => {
            state.LoadingFeed = false;

            if (response.Status.Code === 0) {
              this.activatedRoute
              state.Feed = response.Items;
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

  public async SetActiveEnterprise(
    state: ApplicationsFlowState,
    activeEntLookup: string
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;
      state.LoadingFeed = true;

      this.appsFlowSvc.SetActiveEnterprise(activeEntLookup).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            this.EditingProjectLookup = null;

            console.log('project service active ent: ', activeEntLookup);

            state.ActiveEnterpriseLookup = activeEntLookup;

            console.log(
              'project service State active ent: ',
              state.ActiveEnterpriseLookup
            );

            var results = await Promise.all([
              this.LoadEnterpriseAsCode(state),
              this.LoadUserFeed(1, 25, state),
            ]);

            resolve(results[0]);
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
            var results = await Promise.all([
              this.LoadEnterpriseAsCode(state),
              this.LoadUserFeed(1, 25, state),
            ]);

            resolve(response.Status);
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

  public ToggleCreateProject(): void {
    this.SetCreatingProject(!this.CreatingProject);
  }

  public UnpackLowCodeUnit(
    state: ApplicationsFlowState,
    req: UnpackLowCodeUnitRequest
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.UnpackLowCodeUnit(req).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            const eac = await this.LoadEnterpriseAsCode(state);

            resolve(eac);
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
  protected loadApplicationsForFeed(state: ApplicationsFlowState, paramMap: any) {
    // this.activatedRoute.paramMap.subscribe(async (paramMap) => {
    var project = paramMap.get('projectLookup') || '';

    var route = paramMap.get('appRoute');

    var application = paramMap.get('appLookup');

    var applications: string[] = [];

    if (application) {
      applications.push(application);
    } else if (route && project) {
      const apps: { [lookup: string]: EaCApplicationAsCode } = {};

      state.EaC.Projects[project].ApplicationLookups.forEach(
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
