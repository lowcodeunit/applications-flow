import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Guid } from '@lcu/common';
import { EaCApplicationAsCode, EaCSourceControl } from '@semanticjs/common';
import { SourceControlFormControlsComponent } from '../../elements/projects/controls/forms/source-control/source-control.component';
import { EaCService } from '../../services/eac.service';

@Component({
  selector: 'lcu-processor-details-form',
  templateUrl: './processor-details-form.component.html',
  styleUrls: ['./processor-details-form.component.scss']
})
export class ProcessorDetailsFormComponent implements OnInit {

  

  @Input('editing-application') 
  public EditingApplication: EaCApplicationAsCode;

  @Input('editing-application-lookup')
  public EditingApplicationLookup: string;

  @ViewChild(SourceControlFormControlsComponent)
  public SourceControlFormControls: SourceControlFormControlsComponent;

  public get BuildFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.build;
  }
  
  public get ClientIDFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.clientId;
  }

  public get DefaultFileFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.defaultFile;
  }

  public get DefaultSourceControl(): EaCSourceControl {
    return {
      Organization: this.EditingApplication?.LowCodeUnit?.Organization,
      Repository: this.EditingApplication?.LowCodeUnit?.Repository,
    };
  }

  public get InboundPathFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.inboundPath;
  }

  public get TokenLookupFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.tokenLookup;
  }

  public get RedirectFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.redirect;
  }

  public get ScopesFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.scopes;
  }

  public get SecurityFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.security;
  }

  public get SPARootFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.spaRoot;
  }

  public get PermanentFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.permanent;
  }

  public get PreserveMethodFormControl(): AbstractControl {
    return this.ProcessorDetailsFormGroup?.controls.preserveMethod;
  }

  public IsPermanent: boolean;

  public IsPreserve: boolean;

  public LCUType: string;
  
  public redirectTooltip: string;

  public ProcessorDetailsFormGroup: FormGroup;

  public ProcessorType: string;

  constructor(protected formBldr: FormBuilder, 
    protected eacSvc: EaCService) {

    this.redirectTooltip = '';

   }

  public ngOnInit(): void {

    if(!this.EditingApplication){
      this.CreateNewApplication();
    }
    else{
      this.setupProcessorDetailsForm();
    }

  }

  public CreateNewApplication(): void {
    this.SetEditingApplication(Guid.CreateRaw());
  }

  public DetermineTooltipText() {
    let permanentValue = this.PermanentFormControl.value;
    let preserveValue = this.PreserveMethodFormControl.value;

    if (permanentValue === true && preserveValue === false) {
      this.redirectTooltip = '301 – Permanent and Not Preserve';
    } else if (permanentValue === false && preserveValue === false) {
      this.redirectTooltip = '302 – Not Permanent and Not Preserve';
    } else if (permanentValue === false && preserveValue === true) {
      this.redirectTooltip = '307 – Not Permanent and Preserve';
    } else if (permanentValue === true && preserveValue === true) {
      this.redirectTooltip = '308 – Permanent and Preserve';
    }
  }

  public SetEditingApplication(appLookup: string): void {
    this.EditingApplicationLookup = appLookup;

    this.setupProcessorDetailsForm();
  }

  public SubmitProcessorDetails(){
    console.log("submitting proc details: ", this.ProcessorDetailsFormGroup.value)
  }

  public ProcessorTypeChanged(event: MatSelectChange): void {
    this.ProcessorType = event.value;

    this.setupProcessorTypeSubForm();
  }

  public LCUTypeChanged(event: MatSelectChange): void {
    this.LCUType = event.value;

    this.setupLcuTypeSubForm();
  }

  //HELPERS

  protected cleanupLcuTypeSubForm(): void {
    this.ProcessorDetailsFormGroup.removeControl('methods');
    this.ProcessorDetailsFormGroup.removeControl('apiRoot');
    this.ProcessorDetailsFormGroup.removeControl('security');

    this.ProcessorDetailsFormGroup.removeControl('spaRoot');

    this.ProcessorDetailsFormGroup.removeControl('applicationId');

    this.ProcessorDetailsFormGroup.removeControl('build');

    this.ProcessorDetailsFormGroup.removeControl('clientId');
    this.ProcessorDetailsFormGroup.removeControl('clientSecret');

    this.ProcessorDetailsFormGroup.removeControl('zipFile');
  }

  protected cleanupProcessorTypeSubForm(): void {
    this.ProcessorDetailsFormGroup.removeControl('defaultFile');

    // this.ApplicationFormGroup.removeControl('dfsLcuType');

    // this.ApplicationFormGroup.removeControl('oauthLcuType');
    this.ProcessorDetailsFormGroup.removeControl('scopes');
    this.ProcessorDetailsFormGroup.removeControl('tokenLookup');

    this.ProcessorDetailsFormGroup.removeControl('inboundPath');
    this.ProcessorDetailsFormGroup.removeControl('proxyLcuType');

    this.ProcessorDetailsFormGroup.removeControl('redirect');
    this.ProcessorDetailsFormGroup.removeControl('permanent');
    this.ProcessorDetailsFormGroup.removeControl('preserveMethod');

    this.cleanupLcuTypeSubForm();
  }

  protected setupLcuTypeSubForm(): void {
    this.cleanupLcuTypeSubForm();

    // this.ApplicationFormGroup.removeControl('package');
    // this.ApplicationFormGroup.removeControl('version');

    if (this.LCUType) {
      switch (this.LCUType) {
        case 'API':
          this.setupLCUAPIForm();
          break;

        case 'ApplicationPointer':
          this.setupLCUApplicationPointerForm();
          break;

        case 'GitHub':
          this.setupLCUGitHubForm();
          break;

        case 'GitHubOAuth':
          this.setupLCUGitHubOAuthForm();
          break;

        // case 'NPM':
        //   this.setupLCUNPMForm();
        //   break;

        case 'SPA':
          this.setupLCUSPAForm();
          break;

        case 'Zip':
          this.setupLCUZipForm();
          break;
      }
    }
  }

  protected setupProcessorDetailsForm(): void {
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';

    console.log("EDITING APP = ", this.EditingApplication);

    if (this.EditingApplication != null) {
      this.ProcessorDetailsFormGroup = this.formBldr.group({

        procType: [this.ProcessorType, [Validators.required]]

      });
      this.setupDfsForm();

      this.setupLcuTypeSubForm();

    }
  }

  protected setupLCUGitHubForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'build',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.Build || 'latest',
        [Validators.required]
      )
    );
  }

  protected setupLCUApplicationPointerForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'applicationId',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ApplicationID || '',
        [Validators.required]
      )
    );
  }

  // protected setupLCUNPMForm(): void {
    // this.ApplicationFormGroup.addControl(
    //   'package',
    //   this.formBldr.control(
    //     this.EditingApplication.LowCodeUnit?.Package || '',
    //     [Validators.required]
    //   )
    // );
    // this.ApplicationFormGroup.addControl(
    //   'version',
    //   this.formBldr.control(
    //     this.EditingApplication.LowCodeUnit?.Version || '',
    //     [Validators.required]
    //   )
    // );
  // }

  protected setupLCUSPAForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'spaRoot',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.SPARoot || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUAPIForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'methods',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.AllowedMethods?.join(' ') || '',
        []
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'apiRoot',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.APIRoot || '',
        [Validators.required]
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'security',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.Security || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUGitHubOAuthForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'clientId',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ClientID || '',
        [Validators.required]
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'clientSecret',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ClientSecret || '',
        [Validators.required]
      )
    );
  }

  protected setupProxyForm(): void {
    this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

    this.ProcessorDetailsFormGroup.addControl(
      'inboundPath',
      this.formBldr.control(
        this.EditingApplication.Processor?.InboundPath || '',
        [Validators.required]
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupRedirectForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'redirect',
      this.formBldr.control(this.EditingApplication.Processor?.Redirect || '', [
        Validators.required,
      ])
    );

    this.ProcessorDetailsFormGroup.addControl(
      'permanent',
      this.formBldr.control(
        this.EditingApplication.Processor?.Permanent || false,
        []
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'preserveMethod',
      this.formBldr.control(
        this.EditingApplication.Processor?.PreserveMethod || false,
        []
      )
    );
    this.DetermineTooltipText();
  }

  protected setupOAuthForm(): void {
    this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

    this.ProcessorDetailsFormGroup.addControl(
      'scopes',
      this.formBldr.control(
        this.EditingApplication.Processor?.Scopes?.Join(' ') || '',
        [Validators.required]
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'tokenLookup',
      this.formBldr.control(
        this.EditingApplication.Processor?.TokenLookup || '',
        [Validators.required]
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupLCUZipForm(): void {
    this.ProcessorDetailsFormGroup.addControl(
      'zipFile',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ZipFile || '',
        [Validators.required]
      )
    );
  }

  protected setupDfsForm(): void {
    this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

    this.ProcessorDetailsFormGroup.addControl(
      'defaultFile',
      this.formBldr.control(
        this.EditingApplication.Processor?.DefaultFile || 'index.html',
        [Validators.required]
      )
    );

    this.ProcessorDetailsFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupProcessorTypeSubForm(): void {
    this.cleanupProcessorTypeSubForm();

    if (this.ProcessorType) {
      switch (this.ProcessorType) {
        case 'DFS':
          this.setupDfsForm();
          break;

        case 'OAuth':
          this.setupOAuthForm();
          break;

        case 'Proxy':
          this.setupProxyForm();
          break;

        case 'Redirect':
          this.setupRedirectForm();
          break;
      }
    }

    this.setupLcuTypeSubForm();
  }

  // protected SaveApplication(): void {
  //   const app: EaCApplicationAsCode = {
  //     // Application: {
  //     //   Name: this.NameFormControl.value,
  //     //   Description: this.DescriptionFormControl.value,
  //     //   PriorityShift: this.EditingApplication?.Application?.PriorityShift || 0,
  //     // },
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

  //   this.eacSvc.SaveApplicationAsCode(saveAppReq);
  // }

}
