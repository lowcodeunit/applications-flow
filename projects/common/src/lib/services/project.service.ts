import { Injectable } from '@angular/core';
import { BaseModeledResponse, BaseResponse } from '@lcu/common';
import { debug } from 'console';
import { EaCProjectAsCode, EnterpriseAsCode } from '../models/eac.models';
import {
  ApplicationsFlowState,
  GitHubWorkflowRun,
  UnpackLowCodeUnitRequest,
} from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public CreatingProject: boolean;

  public EditingProjectLookup: string;

  constructor(protected appsFlowSvc: ApplicationsFlowService) {}

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

  public HasValidConnection(
    state: ApplicationsFlowState
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.HasValidConnection().subscribe(
        async (response: BaseResponse) => {
          state.GitHub.HasConnection = response.Status.Code === 0;

          if (state.GitHub.HasConnection) {
            const eac = await this.EnsureUserEnterprise(state);

            resolve(eac);
          } else {
            state.Loading = false;

            resolve({});
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

  public async ListEnterprises(state: ApplicationsFlowState): Promise<any[]> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.ListEnterprises().subscribe(
        async (response: BaseModeledResponse<Array<any>>) => {
          state.Loading = false;

          if (response.Status.Code === 0) {
            state.Enterprises = response.Model;

            resolve(response.Model);
          } else {
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

  public LoadEnterpriseAsCode(
    state: ApplicationsFlowState
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.LoadEnterpriseAsCode().subscribe(
        (response: BaseModeledResponse<EnterpriseAsCode>) => {
          state.Loading = false;

          if (response.Status.Code === 0) {
            state.EaC = response.Model;
          } else if (response.Status.Code === 3) {
          }

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

  public async SetActiveEnterprise(
    state: ApplicationsFlowState,
    activeEntLookup: string
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc.SetActiveEnterprise(activeEntLookup).subscribe(
        async (response: BaseResponse) => {
          if (response.Status.Code === 0) {
            this.EditingProjectLookup = null;

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

  public async SaveEnterpriseAsCode(
    state: ApplicationsFlowState,
    eac: EnterpriseAsCode
  ): Promise<EnterpriseAsCode> {
    return new Promise((resolve, reject) => {
      state.Loading = true;

      this.appsFlowSvc
        .SaveEnterpriseAsCode(eac, state.HostDNSInstance)
        .subscribe(
          async (response: BaseModeledResponse<string>) => {
            if (response.Status.Code === 0) {
              eac = await this.LoadEnterpriseAsCode(state);

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
        state.Loading = true;

        this.appsFlowSvc.IsolateHostDNSInstance().subscribe(
          (response: BaseModeledResponse<string>) => {
            state.Loading = false;

            this.EditingProjectLookup = projectLookup;

            this.CreatingProject = false;

            state.HostDNSInstance = response.Model;

            resolve({});

            console.log(state);
          },
          (err) => {
            state.Loading = false;

            reject(err);

            console.log(err);
          }
        );
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
}
