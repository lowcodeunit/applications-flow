import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from '@lcu/common';
import { EaCDataToken } from '@semanticjs/common';
import { EaCService, SaveApplicationAsCodeEventRequest } from '../../services/eac.service';

@Component({
  selector: 'lcu-state-config-form',
  templateUrl: './state-config-form.component.html',
  styleUrls: ['./state-config-form.component.scss']
})
export class StateConfigFormComponent implements OnInit {

  @Input('app-lookup')
  public AppLookup: string;

  @Input('config')
  public Config: EaCDataToken;

  public get StateConfigNameFormControl(): AbstractControl{
    return this.StateConfigForm?.controls.name;
  }

  public get StateConfigDescriptionFormControl(): AbstractControl{
    return this.StateConfigForm?.controls.description;
  }

  public get StateConfigValueFormControl(): AbstractControl{
    return this.StateConfigForm?.controls.value;
  }

  public StateConfigForm: FormGroup;

  constructor( protected eacSvc: EaCService,
    public formbldr: FormBuilder) { 

    this.StateConfigForm = this.formbldr.group({});

  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public SaveStateConfig(){
    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ApplicationLookup: this.AppLookup || Guid.CreateRaw(),
      DataToken: {
        Name: this.StateConfigNameFormControl.value,
        Description: this.StateConfigDescriptionFormControl.value,
        Value: this.StateConfigValueFormControl.value
      }

    }
    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  protected buildForm(){
    this.StateConfigForm.addControl(
      'name',
      this.formbldr.control(
        this.Config?.Name ? this.Config?.Name : '', 
        [Validators.required]
      )
    );

    this.StateConfigForm.addControl(
      'description',
      this.formbldr.control(this.Config?.Description ? this.Config?.Description : '', 
      [Validators.required]
    )
    );

    this.StateConfigForm.addControl(
      'value',
      this.formbldr.control(this.Config?.Value ? this.Config?.Value : '', 
      [Validators.required]
    )
    );
  }

}
