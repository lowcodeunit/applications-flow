import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCProjectAsCode } from '@semanticjs/common';
import { EditProjectFormComponent } from '../../controls/edit-project-form/edit-project-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface ProjectDialogData {
  
  projectLookup: string;
}

@Component({
  selector: 'lcu-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit {

  @ViewChild(EditProjectFormComponent)
  public EditProjectControl: EditProjectFormComponent;

  public get Project(): EaCProjectAsCode{
    return this.State?.EaC?.Projects[this.data.projectLookup];
  }

  public get ProjectFormGroup(): FormGroup {
    return this.EditProjectControl?.ProjectFormGroup;
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public ErrorMessage: string;

  constructor(public eacSvc: EaCService,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData,
    protected snackBar: MatSnackBar) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public HandleSaveProjectEvent(event: Status){
    console.log("event to save: ", event);
    if (event.Code === 0){
      this.snackBar.open("Project Succesfully Updated", "Dismiss",{
        duration: 5000
      });
      this.CloseDialog();
    }
    else{
      this.ErrorMessage = event.Message;
    }
  }

  public SaveProject(){
    this.EditProjectControl.SaveProject();
  }

}
