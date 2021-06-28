import { DomainModel } from './../../../../../models/domain.model';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lcu-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  /**
   * Access form control for root directory
   */
  public get Domain(): AbstractControl {
    return this.DomainForm.get('domain');
  }

  /**
   * List of domains
   */
  public Domains: Array<DomainModel>;

  /**
   * Main FormGroup
   */
  public DomainForm: FormGroup;

  /**
   * Card subtitle
   */
  public Subtitle: string;

  constructor() {
    this.Subtitle = 'These domains are assigned to your deployments. Optionally, a different Git branch or a redirection to another domain can be configured for each one.'
    this.Domains = [
      {
        Branch: 'Integration',
        Name: 'pimpire.fathym.int',
        Host: 'pimpire.fathym.int',
        ValidConfig: 'Valid'
      },
      {
        Branch: 'Integration',
        Name: 'pimpire.fathym.int',
        Host: 'pimpire.fathym.int',
        ValidConfig: 'Valid'
      }
    ];
  }

  ngOnInit(): void {
    this.setupForm();
  }

  protected setupForm(): void {
    this.DomainForm = new FormGroup({
      domain: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change'
      }),
    });
  }

}
