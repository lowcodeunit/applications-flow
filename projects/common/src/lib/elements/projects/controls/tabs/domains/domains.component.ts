import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
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
   * Card / Form Config
   */
  public Config: CardFormConfigModel;

  /**
   * FormGroup
   */
  public Form: FormGroup;

  /**
   * Access form control for root directory
   */
  public get Domain(): AbstractControl {
    return this.Form.get('domain');
  }

  /**
   * List of domains
   */
  public Domains: Array<DomainModel>;

  constructor() {
  }

  ngOnInit(): void {
    this.setupForm();

    this.config();
  }

  protected config(): void {
   this.Config = new CardFormConfigModel({
     Icon: 'head',
     Title: 'Domains',
     Subtitle: 'These domains are assigned to your deployments. Optionally, a different Git branch or a redirection to another domain can be configured for each one.'
   });

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

  protected setupForm(): void {
    this.Form = new FormGroup({
      domain: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change'
      }),
    });
  }

}
