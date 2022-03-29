import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Guid } from '@lcu/common';
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
  public Config: string;

  public get StateConfigFormControl(): AbstractControl{
    return this.StateConfigDialogForm.controls.config;
  }

  public StateConfigDialogForm: FormGroup;

  constructor( protected eacSvc: EaCService,
    public formbldr: FormBuilder) { 

    this.StateConfigDialogForm = this.formbldr.group({});

  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public SaveStateConfig(){
    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ApplicationLookup: this.AppLookup || Guid.CreateRaw(),
      DataToken: this.StateConfigFormControl.value

    }
    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  protected buildForm(){
    this.StateConfigDialogForm.addControl(
      'config',
      this.formbldr.control(this.Config ? this.Config : '')
    );
  }

}
