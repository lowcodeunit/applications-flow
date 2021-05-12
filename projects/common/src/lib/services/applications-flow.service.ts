import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { LCUServiceSettings, StateContext } from '@lcu/common';
import { ApplicationsFlowState, EstablishProjectRequest } from '../state/applications-flow.state';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsFlowService {
  //  Fields
  protected apiRoot: string;

  // Constructors
  constructor(protected http: HttpClient, protected settings: LCUServiceSettings) {
    this.apiRoot = settings.APIRoot;
  }

  // API Methods
  public BootUserEnterprise(request: EstablishProjectRequest) {
    return this.http.post(`${this.apiRoot}/api/lowcodeunit/manage/boot`, request, {
      headers: this.loadHeaders()
    });
  }

  public ListProjects() {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/manage/projects`, {
      headers: this.loadHeaders()
    });
  }

  public HasValidConnection() {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/github/connection/valid`, {
      headers: this.loadHeaders()
    });
  }

  public ListBranches(organization: string, repository: string) {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/github/organizations/${organization}/repositories/${repository}/branches`, {
      headers: this.loadHeaders()
    });
  }

  public ListOrganizations() {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/github/organizations`, {
      headers: this.loadHeaders()
    });
  }

  public ListRepositories(organization: string) {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/github/organizations/${organization}/repositories`, {
      headers: this.loadHeaders()
    });
  }

  public LoadProjectHostingDetails(organization: string, repository: string, branch: string) {
    return this.http.get(`${this.apiRoot}/api/lowcodeunit/manage/projects/organizations/${organization}/repositories/${repository}/branches/${branch}/hosting/details`, {
      headers: this.loadHeaders()
    });
  }

  //  Helpers
  protected loadHeaders(): { [header: string]: string | string[] } {
    return {
      'lcu-processor-lookup': this.settings?.State?.Environment || ''
    };
  }

}
