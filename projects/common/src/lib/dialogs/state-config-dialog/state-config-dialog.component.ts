import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { StateConfigFormComponent } from '../../controls/state-config-form/state-config-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface StateConfigDialogData {
  appLookup: string;
  config: string;
}

@Component({
  selector: 'lcu-state-config-dialog',
  templateUrl: './state-config-dialog.component.html',
  styleUrls: ['./state-config-dialog.component.scss']
})

export class StateConfigDialogComponent implements OnInit {

  @ViewChild(StateConfigFormComponent)
  public StateConfigForm: StateConfigFormComponent;

  public get Application(): EaCApplicationAsCode {
    return this.State.EaC.Applications[this.data.appLookup];
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }


  public StateConfigDialogForm: FormGroup;

  constructor(protected eacSvc: EaCService,
    public dialogRef: MatDialogRef<StateConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StateConfigDialogData,
    protected snackBar: MatSnackBar) {
     
     }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public SaveStateConfig(){
    this.StateConfigForm.SaveStateConfig();
  }

  

}