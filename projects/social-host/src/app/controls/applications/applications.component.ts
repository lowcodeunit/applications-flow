import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsFlowState, EaCService } from '@lowcodeunit/applications-flow-common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EaCApplicationAsCode, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import { Guid } from '@lcu/common';


@Component({
  selector: 'lcu-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  

  public ApplicationFormGroup: FormGroup;

  public EditingApplicationLookup: string;

  public ProcessorType: string;
  
  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public Stats: any;

  public SourceControlData: any;

  protected appLookup: string;

  protected projectLookup: string;

  public get Application(): any{
    return this.State?.EaC?.Applications[this.appLookup] || {};
  }

  public get Applications(): any{
    return this.State?.EaC?.Applications;
  }

  public get DefaultSourceControl(): EaCSourceControl {
    return {
      Organization: this.EditingApplication?.LowCodeUnit?.Organization,
      Repository: this.EditingApplication?.LowCodeUnit?.Repository,
    };
  }

  public get DescriptionFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.description;
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment];
  }

  public get IsPrivateFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.isPrivate;
  }

  public get EditingApplication(): EaCApplicationAsCode {
    let app = this.Applications
      ? this.Applications[this.EditingApplicationLookup]
      : null;

    if (app == null && this.EditingApplicationLookup) {
      app = {};
    }

    return app;
  }

  public get IsTriggerSignInFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.isTriggerSignIn;
  }

  public get MethodsFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.methods;
  }

  public get NameFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.name;
  }

  public get PackageFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.package;
  }

  constructor(private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService,
    protected formBldr: FormBuilder) {
      this.EditingApplicationLookup = null;

      this.Stats = [{Name: "Retention Rate", Stat: "85%"}, 
   {Name: "Bounce Rate", Stat: "38%"}, 
   {Name: "Someother Rate", Stat: "5%"}];

   this.activatedRoute.params.subscribe(params => {
    this.appLookup = params['appLookup'];
    this.projectLookup = params['projectLookup'];
  });


  }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => {});

    if (this.appLookup) {
      this.CreateNewApplication();
    }

  }

  //  API Methods
  public CreateNewApplication(): void {
    this.SetEditingApplication(Guid.CreateRaw());
  }

  public HandleLeftClickEvent(event: any){

  }

  public HandleRightClickEvent(event: any){
    
  }

  public UpgradeClicked(){

  }

  public SettingsClicked(){

  }

  public SetEditingApplication(appLookup: string): void {
    this.EditingApplicationLookup = appLookup;

    this.setupApplicationForm();
  }

  // public SaveApplication(): void {
  //   const app: EaCApplicationAsCode = {
  //     Application: {
  //       Name: this.NameFormControl.value,
  //       Description: this.DescriptionFormControl.value,
  //       PriorityShift: this.EditingApplication?.Application?.PriorityShift || 0,
  //     },
  //     AccessRightLookups: [],
  //     DataTokens: {},
  //     LicenseConfigurationLookups: [],
  //     LookupConfig: {
  //       IsPrivate: this.IsPrivateFormControl.value,
  //       IsTriggerSignIn: this.IsPrivateFormControl.value
  //         ? this.IsTriggerSignInFormControl.value
  //         : false,
  //       PathRegex: `${this.RouteFormControl.value}.*`,
  //       QueryRegex: this.EditingApplication?.LookupConfig?.QueryRegex || '',
  //       HeaderRegex: this.EditingApplication?.LookupConfig?.HeaderRegex || '',
  //       AllowedMethods: this.MethodsFormControl?.value
  //         ?.split(' ')
  //         .filter((v: string) => !!v),
  //     },
  //     Processor: {
  //       Type: this.ProcessorType,
  //     },
  //   };

  //   switch (app.Processor.Type) {
  //     case 'DFS':
  //       app.Processor.BaseHref = `${this.RouteFormControl.value}/`.replace(
  //         '//',
  //         '/'
  //       );

  //       app.Processor.DefaultFile =
  //         this.DefaultFileFormControl.value || 'index.html';

  //       app.LowCodeUnit = {
  //         Type: this.LCUType,
  //       };

  //       switch (app.LowCodeUnit.Type) {
  //         case 'GitHub':
  //           app.LowCodeUnit.Organization =
  //             this.SourceControlFormControls.OrganizationFormControl.value;

  //           app.LowCodeUnit.Repository =
  //             this.SourceControlFormControls.RepositoryFormControl.value;

  //           app.LowCodeUnit.Build = this.BuildFormControl.value;

  //           app.LowCodeUnit.Path =
  //             this.SourceControlFormControls.BuildPathFormControl.value;
  //           break;

  //         case 'NPM':
  //           app.LowCodeUnit.Package = this.PackageFormControl.value;

  //           app.LowCodeUnit.Version = this.VersionFormControl.value;
  //           break;

  //         case 'Zip':
  //           app.LowCodeUnit.ZipFile = this.ZipFileFormControl.value;
  //           break;
  //       }
  //       break;

  //     case 'OAuth':
  //       app.Processor.Scopes = this.ScopesFormControl.value.split(' ');

  //       app.Processor.TokenLookup = this.TokenLookupFormControl.value;

  //       app.LowCodeUnit = {
  //         Type: this.LCUType,
  //       };

  //       switch (app.LowCodeUnit.Type) {
  //         case 'GitHubOAuth':
  //           app.LowCodeUnit.ClientID = this.ClientIDFormControl.value;

  //           app.LowCodeUnit.ClientSecret = this.ClientSecretFormControl.value;
  //           break;
  //       }
  //       break;

  //     case 'Proxy':
  //       app.Processor.InboundPath = this.InboundPathFormControl.value;

  //       app.LowCodeUnit = {
  //         Type: this.LCUType,
  //       };

  //       switch (app.LowCodeUnit.Type) {
  //         case 'API':
  //           app.LowCodeUnit.APIRoot = this.APIRootFormControl.value;

  //           app.LowCodeUnit.Security = this.SecurityFormControl.value;

  //           break;

  //         case 'SPA':
  //           app.LowCodeUnit.SPARoot = this.SPARootFormControl.value;
  //           break;
  //       }
  //       break;

  //     case 'Redirect':
  //       app.Processor.Permanent = !!this.PermanentFormControl.value;

  //       app.Processor.PreserveMethod = !!this.PreserveMethodFormControl.value;

  //       app.Processor.Redirect = this.RedirectFormControl.value;
  //       break;
  //   }

  //   if (!app.LookupConfig.PathRegex.startsWith('/')) {
  //     app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
  //   }

  //   const saveAppReq: SaveApplicationAsCodeEventRequest = {
  //     ProjectLookup: this.ProjectLookup,
  //     Application: app,
  //     ApplicationLookup: this.EditingApplicationLookup || Guid.CreateRaw(),
  //   };

  //   if (this.HasBuildFormControl.value && this.ProcessorType !== 'redirect') {
  //     if (app) {
  //       app.SourceControlLookup = this.SourceControlLookupFormControl.value;
  //     }
  //   } else if (app) {
  //     app.SourceControlLookup = null;
  //   }

  //   this.appsFlowEventsSvc.SaveApplicationAsCode(saveAppReq);
  // }

  //HELPERS


  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();
  }


  protected setupApplicationForm(): void {
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';
    console.log('ProcessorType = ', this.ProcessorType);

    if (this.EditingApplication != null) {
      this.ApplicationFormGroup = this.formBldr.group({
        name: [this.EditingApplication.Application?.Name, Validators.required],
        description: [
          this.EditingApplication.Application?.Description,
          Validators.required,
        ],
        route: [
          this.EditingApplication.LookupConfig?.PathRegex.replace('.*', '') ||
            '/',
          Validators.required,
        ],
        // priority: [
        //   this.EditingApplication.Application?.Priority || 10000,
        //   Validators.required,
        // ],
        procType: [this.ProcessorType, [Validators.required]],
      });

      this.setupBuildForm();

      this.setupSecurityForm();

      // this.setupProcessorTypeSubForm();
    }
  }

  protected setupBuildForm(): void {
    this.ApplicationFormGroup.addControl(
      'hasBuild',
      this.formBldr.control(
        !!this.EditingApplication.LowCodeUnit?.SourceControlLookup || false,
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'sourceControlLookup',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.SourceControlLookup || '',
        []
      )
    );
  }

  protected setupSecurityForm(): void {
    
    this.ApplicationFormGroup.addControl(
      'isPrivate',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.IsPrivate || false,
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'isTriggerSignIn',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.IsTriggerSignIn || false,
        [Validators.required]
      )
    );
  }


}
