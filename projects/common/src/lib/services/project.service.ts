import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProjectItemModel } from '../models/project-item.model';
import { ProjectState } from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';

@Injectable({
    providedIn: 'root',
  })

  export class ProjectService {
    /**
     * Subject for editing project settings
     */
    public SetEditProjectSettings: Subject<ProjectItemModel>;

    public CurrentSelectedProject: Subject<ProjectState>;

    constructor(protected appsFlowSvc: ApplicationsFlowService) {
        this.SetEditProjectSettings = new Subject<ProjectItemModel>();
        this.CurrentSelectedProject = new Subject<ProjectState>();
    }
  }
