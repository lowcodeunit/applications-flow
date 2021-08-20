import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { LCUServiceSettings, StateContext } from '@lcu/common';
import { Observable, Subject } from 'rxjs';
import {
  ApplicationsFlowState,
  EstablishProjectRequest,
  GitHubLowCodeUnit,
  ProjectState,
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
  public EnsureUserEnterprise(): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/enterprise/ensure`,
      {},
      {
        headers: this.loadHeaders(),
      }
    );
  }

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

  public DeleteProject(projectId: string): Observable<object> {
    return this.http.delete(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/${projectId}`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public DeployRun(run: GitHubWorkflowRun): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/deploy`,
      run,
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

  public IsolateHostDNSInstance(): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/isolate`,
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

  public LoadProjectHostingDetails(
    organization: string,
    repository: string,
    branch: string
  ): Observable<object> {
    return this.http.get(
      `${this.apiRoot}/api/lowcodeunit/manage/projects/organizations/${organization}/repositories/${repository}/branches/${branch}/hosting/details`,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  public SaveProject(
    project: ProjectState,
    hostDnsInstance: string
  ): Observable<object> {
    return this.http.post(
      `${this.apiRoot}/api/lowcodeunit/manage/projects?hostDnsInstance=${hostDnsInstance}`,
      project,
      {
        headers: this.loadHeaders(),
      }
    );
  }

  //  Helpers
  protected loadHeaders(): { [header: string]: string | string[] } {
    return {
      'lcu-processor-lookup': this.settings?.State?.Environment || '',
    };
  }
}
