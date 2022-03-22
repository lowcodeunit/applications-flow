import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { DFSModifiersFormComponent } from '../../controls/dfs-modifiers-form/dfs-modifiers-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';


export interface DFSModifiersDialogData {
  modifierLookup: string;
}

@Component({
  selector: 'lcu-dfs-modifiers-dialog',
  templateUrl: './dfs-modifiers-dialog.component.html',
  styleUrls: ['./dfs-modifiers-dialog.component.scss']
})

export class DFSModifiersDialogComponent implements OnInit {

  @ViewChild(DFSModifiersFormComponent)
  public DFSModifersFormControls: DFSModifiersFormComponent;

  // public get Application(): EaCApplicationAsCode {
  //   return this.State?.EaC?.Applications[this.data.applicationLookup] || {};
  // }

  // public get Environment(): EaCEnvironmentAsCode {
  //   return this.State?.EaC?.Environments[this.data.environmentLookup];
  // }

  // public get SourceControls(): { [lookup: string]: EaCSourceControl } {
  //   return this.Environment?.Sources || {};
  // }

  // public get SourceControlLookups(): Array<string> {
  //   return Object.keys(this.Environment?.Sources || {});
  // }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public get DFSModifersFormGroup(): FormGroup{
    return this.DFSModifersFormControls?.ModifierFormGroup;
  }

  public ErrorMessage: string;

  constructor(protected eacSvc: EaCService, 
    public dialogRef: MatDialogRef<DFSModifiersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DFSModifiersDialogData,
    protected snackBar: MatSnackBar) {
     
     }

  public ngOnInit(): void {
    console.log("MDF lookup at dialog: ", this.data.modifierLookup)
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public HandleSaveFormEvent(event: Status){
    console.log("event: ", event);
    if (event.Code === 0){
      this.snackBar.open("DFS Modifier Saved Successfully", "Dismiss",{
        duration: 5000
      });
      this.CloseDialog();
    }
    else{
      this.ErrorMessage = event.Message;
    }
  }

  public SaveDFSModifier(){
    this.DFSModifersFormControls.SaveModifier();

  }


  

}
