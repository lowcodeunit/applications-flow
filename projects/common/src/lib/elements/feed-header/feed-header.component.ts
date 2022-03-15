import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedHeaderDialogComponent } from '../../dialogs/feed-header-dialog/feed-header-dialog.component';
import { NewApplicationDialogComponent } from '../../dialogs/new-application-dialog/new-application-dialog.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss']
})
export class FeedHeaderComponent implements OnInit {

  public get ActiveEnvironmentLookup(): string {
    //  TODO:  Eventually support multiple environments
    const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    return envLookups[0];
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public InputLabel: string;

  public SkeletonEffect: string;

  protected selectedBtn: string;

  public value: string;

  constructor( 
      protected eacSvc: EaCService,
      protected dialog: MatDialog) { 

    this.InputLabel = "Create Team Announcement";
    this.SkeletonEffect = "wave";
    // this.selectedBtn = "pr-btn";

  }

  public ngOnInit(): void {
    
  }

  public ngAfterViewInit(){
    this.addSelectBtn();
  }

  public CreateFeatureBranch(){
    this.removeSelectedBtn();
    this.InputLabel = "Create Feature Branch";
    this.selectedBtn = "fb-btn";
    this.addSelectBtn();
    console.log("create feature branch selected");
    this.OpenFHDialog('fb');

  }

  public OpenIssue(){
    this.removeSelectedBtn();
    this.InputLabel = "Open Issue";
    this.selectedBtn = "oi-btn";
    this.addSelectBtn();
    console.log("open issue selected");
    this.OpenFHDialog('issue');

  }

  public CreatePullRequest(){
    this.removeSelectedBtn();
    this.InputLabel = "Create Pull Request";
    this.selectedBtn = "pr-btn";
    this.addSelectBtn();
    console.log("create pull request selected");
    this.OpenFHDialog('pr');

  }

  public CreateNewApp(){
    const dialogRef = this.dialog.open(NewApplicationDialogComponent, {
      width: '600px',
      data: {
        environmentLookup: this.ActiveEnvironmentLookup,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log('The dialog was closed');
      // console.log("result:", result)
    });
  }

  public OpenFHDialog(modalType: string){
    const dialogRef = this.dialog.open(FeedHeaderDialogComponent, {
      width: '600px',
      data: {
        dialogTitle: this.InputLabel,
        type: modalType
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log('The dialog was closed');
      // console.log("result:", result)
    });
  }

  public RouteToPath(path: string): void {
    window.location.href = path;
  }


  public Submit(){
    console.log("submitting: ", this.value);
    switch (this.selectedBtn){
      case "pr-btn":
        //Pull request
        console.log("creating pull request: ", this.value);
        break;
      case "oi-btn":
        //Open Issue
        console.log("Open issue: ", this.value);
        break;
      case "fb-btn":
        //Feature Branch
        console.log("creating feature branch: ", this.value);
        break;
      default:
        console.log("hmm")

        break;
    }
  }

  //HELPERS

  protected addSelectBtn(){    
    (<HTMLElement>document.getElementById(this.selectedBtn))?.classList.add('selected');
  }

  protected removeSelectedBtn(){
    (<HTMLElement>document.getElementById(this.selectedBtn))?.classList.remove('selected');
  }

}
