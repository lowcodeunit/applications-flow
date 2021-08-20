import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { BaseResponse, BaseModeledResponse } from '@lcu/common';
import {
  ApplicationsFlowState,
  EstablishProjectRequest,
  GitHubBranch,
  GitHubOrganization,
  GitHubRepository,
  ProjectHostingDetails,
} from '../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../../../../services/applications-flow.service';
import { ApplicationsFlowEventsService } from '../../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-source-control-form-controls',
  templateUrl: './source-control.component.html',
  styleUrls: ['./source-control.component.scss'],
})
export class SourceControlFormControlsComponent implements OnInit {
  //  Fields

  //  Properties
  @ViewChild('branches')
  public BranchesInput: ElementRef<HTMLInputElement>;

  public BranchOptions: GitHubBranch[];

  public CreatingRepository: boolean;

  @Input('form-group')
  public FormGroup: FormGroup;

  public get IsBranchesValid(): boolean {
    return this.FormGroup.get('branches').valid;
  }

  public get IsOrganizationValid(): boolean {
    return this.FormGroup.get('organization').valid;
  }

  public get IsRepositoryValid(): boolean {
    return this.FormGroup.get('repository').valid;
  }

  public Loading: boolean;

  public OrganizationOptions: GitHubOrganization[];

  public RepositoryOptions: GitHubRepository[];

  public SelectedBranches: string[];

  public readonly SeparatorKeysCodes = [ENTER, COMMA] as const;

  @Input('source-control')
  public SourceControl: any; // EaCSourceControl

  //  Constructors
  constructor(
    protected formBuilder: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.SelectedBranches = [];

    this.SourceControl = {};
  }
  //  Life Cycle
  public ngOnInit(): void {
    this.FormGroup.addControl(
      'branches',
      new FormControl(this.SourceControl.Branches ?? '', Validators.required)
    );

    this.FormGroup.addControl(
      'organization',
      new FormControl(
        this.SourceControl.Organization ?? '',
        Validators.required
      )
    );

    this.FormGroup.addControl(
      'repository',
      new FormControl(this.SourceControl.Repository ?? '', Validators.required)
    );

    this.RefreshOrganizations();
  }

  //  API Methods
  public AddBranchOption(event: MatChipInputEvent): void {
    this.addBranchOption(event.value);

    event.input.value = '';
  }

  public BranchOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.addBranchOption(event.option.value);
  }

  public CreateRepository(): void {
    this.CreatingRepository = true;

    this.FormGroup.get('repository').reset();
  }

  public CancelCreateRepository(): void {
    this.CreatingRepository = false;
  }

  public OrganizationChanged(event: MatSelectChange): void {
    const org = this.FormGroup.get('organization');

    if (org !== event.value) {
      this.FormGroup.get('repository').reset();

      this.listRepositories();
    }
  }

  public RefreshOrganizations(): void {
    // this.Loading = true;
    this.listOrganizations();

    this.FormGroup.reset();
  }

  public RemoveBranchOption(option: string): void {
    const index = this.SelectedBranches.indexOf(option);

    if (index >= 0) {
      this.SelectedBranches.splice(index, 1);
    }
  }

  public RepositoryChanged(event: MatSelectChange): void {
    const repo = this.FormGroup.get('repository');

    if (repo !== event.value) {
      this.FormGroup.get('branches').reset();

      this.listBranches();
    }
  }

  public SaveRepository(): void {
    this.Loading = true;

    const org = this.FormGroup.get('organization').value;

    const repoName = this.FormGroup.get('repository').value;

    this.appsFlowSvc
      .CreateRepository(org, repoName)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.listRepositories(repoName);

          this.CreatingRepository = false;
        } else {
          //  TODO:  Need to surface an error to the user...

          this.Loading = false;
        }
      });
  }

  //  Helpers
  protected addBranchOption(value: string): void {
    value = (value || '').trim();

    if (value && this.SelectedBranches.indexOf(value) < 0) {
      this.SelectedBranches.push(value);
    }

    this.BranchesInput.nativeElement.blur();
  }

  protected listBranches(): void {
    this.Loading = true;

    this.appsFlowSvc
      .ListBranches(
        this.FormGroup.get('organization').value,
        this.FormGroup.get('repository').value
      )
      .subscribe((response: BaseModeledResponse<GitHubBranch[]>) => {
        this.BranchOptions = response.Model;

        this.Loading = false;

        if (this.BranchOptions?.length === 1) {
          this.FormGroup.get('repoDetails')
            .get('branch')
            .setValue(this.BranchOptions[0].Name);
        }
      });
  }

  protected listOrganizations(): void {
    this.Loading = true;

    this.appsFlowSvc
      .ListOrganizations()
      .subscribe((response: BaseModeledResponse<GitHubOrganization[]>) => {
        this.OrganizationOptions = response.Model;

        this.Loading = false;
      });
  }

  protected listRepositories(activeRepo: string = null): void {
    this.Loading = true;

    this.appsFlowSvc
      .ListRepositories(this.FormGroup.get('organization').value)
      .subscribe((response: BaseModeledResponse<GitHubRepository[]>) => {
        this.RepositoryOptions = response.Model;

        this.Loading = false;

        if (activeRepo) {
          setTimeout(() => {
            this.FormGroup.get('repository').setValue(activeRepo);

            this.listBranches();
          }, 0);
        } else if (this.RepositoryOptions?.length <= 0) {
          this.CreatingRepository = true;
        }
      });
  }
}
