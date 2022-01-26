import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-processor-details-form',
  templateUrl: './processor-details-form.component.html',
  styleUrls: ['./processor-details-form.component.scss']
})
export class ProcessorDetailsFormComponent implements OnInit {

  public LCUType: string;

  @Input('editing-application') 
  public EditingApplication: EaCApplicationAsCode;

  public get BuildFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.build;
  }
  
  
  public get ClientIDFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.clientId;
  }

  public get DefaultFileFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.defaultFile;
  }

  public get InboundPathFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.inboundPath;
  }

  public get TokenLookupFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.tokenLookup;
  }

  public get RedirectFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.redirect;
  }

  public get ScopesFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.scopes;
  }

  public get SecurityFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.security;
  }

  public get SPARootFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.spaRoot;
  }

  public get PermanentFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.permanent;
  }

  public get PreserveMethodFormControl(): AbstractControl {
    return this.ProsessorDetailsFormGroup?.controls.preserveMethod;
  }
  public IsPermanent: boolean;

  public IsPreserve: boolean;
  
  public redirectTooltip: string;

  public ProsessorDetailsFormGroup: FormGroup;

  public ProcessorType: string;

  constructor(protected formBldr: FormBuilder) {
    // this.EditingApplicationLookup = null;
    this.redirectTooltip = '';
   }

  public ngOnInit(): void {
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
    this.ProsessorDetailsFormGroup.removeControl('methods');
    this.ProsessorDetailsFormGroup.removeControl('apiRoot');
    this.ProsessorDetailsFormGroup.removeControl('security');

    this.ProsessorDetailsFormGroup.removeControl('spaRoot');

    this.ProsessorDetailsFormGroup.removeControl('applicationId');

    this.ProsessorDetailsFormGroup.removeControl('build');

    this.ProsessorDetailsFormGroup.removeControl('clientId');
    this.ProsessorDetailsFormGroup.removeControl('clientSecret');

    this.ProsessorDetailsFormGroup.removeControl('zipFile');
  }

  protected cleanupProcessorTypeSubForm(): void {
    this.ProsessorDetailsFormGroup.removeControl('defaultFile');

    // this.ApplicationFormGroup.removeControl('dfsLcuType');

    // this.ApplicationFormGroup.removeControl('oauthLcuType');
    this.ProsessorDetailsFormGroup.removeControl('scopes');
    this.ProsessorDetailsFormGroup.removeControl('tokenLookup');

    this.ProsessorDetailsFormGroup.removeControl('inboundPath');
    this.ProsessorDetailsFormGroup.removeControl('proxyLcuType');

    this.ProsessorDetailsFormGroup.removeControl('redirect');
    this.ProsessorDetailsFormGroup.removeControl('permanent');
    this.ProsessorDetailsFormGroup.removeControl('preserveMethod');

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

        case 'NPM':
          this.setupLCUNPMForm();
          break;

        case 'SPA':
          this.setupLCUSPAForm();
          break;

        case 'Zip':
          this.setupLCUZipForm();
          break;
      }
    }
  }

  protected setupApplicationForm(): void {
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';

    if (this.EditingApplication != null) {
      this.ProsessorDetailsFormGroup = this.formBldr.group({
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

    }
  }

  protected setupLCUGitHubForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'build',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.Build || 'latest',
        [Validators.required]
      )
    );
  }

  protected setupLCUApplicationPointerForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'applicationId',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ApplicationID || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUNPMForm(): void {
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
  }

  protected setupLCUSPAForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'spaRoot',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.SPARoot || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUAPIForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'methods',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.AllowedMethods?.join(' ') || '',
        []
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
      'apiRoot',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.APIRoot || '',
        [Validators.required]
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
      'security',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.Security || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUGitHubOAuthForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'clientId',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ClientID || '',
        [Validators.required]
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
      'clientSecret',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ClientSecret || '',
        [Validators.required]
      )
    );
  }

  protected setupProxyForm(): void {
    this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

    this.ProsessorDetailsFormGroup.addControl(
      'inboundPath',
      this.formBldr.control(
        this.EditingApplication.Processor?.InboundPath || '',
        [Validators.required]
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupRedirectForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'redirect',
      this.formBldr.control(this.EditingApplication.Processor?.Redirect || '', [
        Validators.required,
      ])
    );

    this.ProsessorDetailsFormGroup.addControl(
      'permanent',
      this.formBldr.control(
        this.EditingApplication.Processor?.Permanent || false,
        []
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
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

    this.ProsessorDetailsFormGroup.addControl(
      'scopes',
      this.formBldr.control(
        this.EditingApplication.Processor?.Scopes?.Join(' ') || '',
        [Validators.required]
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
      'tokenLookup',
      this.formBldr.control(
        this.EditingApplication.Processor?.TokenLookup || '',
        [Validators.required]
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupLCUZipForm(): void {
    this.ProsessorDetailsFormGroup.addControl(
      'zipFile',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.ZipFile || '',
        [Validators.required]
      )
    );
  }

  protected setupDfsForm(): void {
    this.LCUType = this.EditingApplication.LowCodeUnit?.Type || '';

    this.ProsessorDetailsFormGroup.addControl(
      'defaultFile',
      this.formBldr.control(
        this.EditingApplication.Processor?.DefaultFile || 'index.html',
        [Validators.required]
      )
    );

    this.ProsessorDetailsFormGroup.addControl(
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

}
