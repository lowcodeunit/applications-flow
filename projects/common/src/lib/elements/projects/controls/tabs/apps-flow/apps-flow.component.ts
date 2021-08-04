import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { DomainModel } from './../../../../../models/domain.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProjectState } from './../../../../../state/applications-flow.state';
import { ApplicationsFlowEventsService } from '../../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-apps-flow',
  templateUrl: './apps-flow.component.html',
  styleUrls: ['./apps-flow.component.scss'],
})
export class AppsFlowComponent implements OnInit {
  @Input('data')
  public Data: { Project: ProjectState; };

  public get Project(): ProjectState {
    return this.Data.Project;
  }

  constructor(protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  public ngOnInit(): void {}
}
