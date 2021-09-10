import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { LCUServiceSettings, StateContext } from '@lcu/common';
import { Observable, Subject } from 'rxjs';
import { EaCProjectAsCode, EnterpriseAsCode } from '../models/eac.models';
import {
  ApplicationsFlowState,
  UnpackLowCodeUnitRequest,
} from '../state/applications-flow.state';
import { GitHubWorkflowRun } from './../state/applications-flow.state';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsFlowService {
  //  Fields
  protected apiRoot: string;

  //  Properties

  // Constructors
  constructor(
    protected http: HttpClient,
    protected settings: LCUServiceSettings
  ) {
    this.apiRoot = settings.APIRoot;
  }

  // API Methods
  public ConfigureDevOpsAction(actionLookup: string): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/devops/actions/${actionLookup}/configure`,
      {},
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public CreateRepository(
    organization: string,
    repoName: string
  ): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/github/organizations/${organization}/repositories`,
      {
        Name: repoName,
      },
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public DeleteApplication(appLookup: string): Observable<object> {
    return this.http.delete(
      `${this.apiRoot}/api/lowcodeunit/manage/applications/${appLookup}`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public DeleteProject(projectLookup: string): Observable<object> {
    return this.http.delete(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/${projectLookup}`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public EnsureUserEnterprise(): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/enterprise/ensure`,
      {},
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public GetActiveEnterprise(): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/manage/enterprises/active`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public HasValidConnection(): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/github/connection/valid`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public ListProjects(): Observable<object> {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/manage/projects`, {
      headers: this.loadHeaders(),
    });
  }

  public ListBranches(
    organization: string,
    repository: string
  ): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/github/organizations/${organization}/repositories/${repository}/branches`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public ListEnterprises(): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/manage/enterprises/list`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public ListOrganizations(): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/github/organizations`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public ListRepositories(organization: string): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/github/organizations/${organization}/repositories`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public LoadEnterpriseAsCode(): Observable<object> {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/manage/eac`, {
      headers: this.loadHeaders(),
    });
  }

  public LoadProjectHostingDetails(
    organization: string,
    repository: string,
    branch: string
  ): Observable<object> {
    branch = encodeURIComponent(branch);

    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/organizations/${organization}/repositories/${repository}/branches/${branch}/hosting/details`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public SaveEnterpriseAsCode(eac: EnterpriseAsCode): Observable<object> {
    return this.http.post(`${this.apiRoot}/api/lowcodeunit/manage/eac`, eac, {
      headers: this.loadHeaders(),
    });
  }

  public SetActiveEnterprise(activeEntLookup: string): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/enterprises/active`,
      {
        ActiveEnterpriseLookup: activeEntLookup,
      },
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public UnpackLowCodeUnit(req: UnpackLowCodeUnitRequest): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/unpack`,
      req,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  //  Helpers
  protected loadHeaders(): { [header: string]: string | string[] } {
    return {};
  }
}
