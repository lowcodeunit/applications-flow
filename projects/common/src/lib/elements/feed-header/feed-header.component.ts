import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedHeaderDialogComponent } from '../../dialogs/feed-header-dialog/feed-header-dialog.component';
import { NewApplicationDialogComponent } from '../../dialogs/new-application-dialog/new-application-dialog.component';
import { FeedItemAction } from '../../models/user-feed.model';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss']
})
export class FeedHeaderComponent implements OnInit {

  @Input('source-control-lookup')
  public SourceControlLookup: string;

  public get ActiveEnvironmentLookup(): string {
    //  TODO:  Eventually support multiple environments
    const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    return envLookups[0];
  }

  public get FeedHeaderActions(): Array<FeedItemAction>{
    return this.State?.FeedActions;
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public ModalHeader: string;

  public SkeletonEffect: string;

  protected selectedBtn: string;

  public value: string;

  constructor( 
      protected eacSvc: EaCService,
      protected dialog: MatDialog) { 

    this.SkeletonEffect = "wave";
    // this.selectedBtn = "pr-btn";

  }

  public ngOnInit(): void {
    
  }

  public ngAfterViewInit(){
    this.addSelectBtn();
  }

  public CreateAnnouncement(){
    // this.ModalHeader = "Create Team Announcement";
    this.OpenFHDialog('announcement', "Create Team Announcement");

  }

  // public CreateFeatureBranch(){
  //   this.removeSelectedBtn();
  //   this.ModalHeader = "Create Feature Branch";
  //   this.selectedBtn = "fb-btn";
  //   this.addSelectBtn();
  //   console.log("create feature branch selected");
  //   this.OpenFHDialog('branch');

  // }

  

  // public OpenIssue(){
  //   this.removeSelectedBtn();
  //   this.ModalHeader = "Open Issue";
  //   this.selectedBtn = "oi-btn";
  //   this.addSelectBtn();
  //   console.log("open issue selected");
  //   this.OpenFHDialog('issue');

  // }

  // public CreatePullRequest(){
  //   this.removeSelectedBtn();
  //   this.ModalHeader = "Create Pull Request";
  //   this.selectedBtn = "pr-btn";
  //   this.addSelectBtn();
  //   console.log("create pull request selected");
  //   this.OpenFHDialog('pull-request');

  // }

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

  public OpenFHDialog(modalType: string, modalHeader: string){
    const dialogRef = this.dialog.open(FeedHeaderDialogComponent, {
      width: '600px',
      data: {
        dialogTitle: modalHeader,
        type: modalType,
        sourceControlLookup: this.SourceControlLookup ? this.SourceControlLookup : null
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
