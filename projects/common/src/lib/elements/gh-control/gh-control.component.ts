import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-gh-control',
  templateUrl: './gh-control.component.html',
  styleUrls: ['./gh-control.component.scss']
})
export class GhControlComponent implements OnInit {

  public InputLabel: string;

  protected selectedBtn: string;

  public value: string;

  constructor() { 
    this.InputLabel = "Create Pull Request";
    this.selectedBtn = "pr-btn";

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

  }

  public OpenIssue(){
    this.removeSelectedBtn();
    this.InputLabel = "Open Issue";
    this.selectedBtn = "oi-btn";
    this.addSelectBtn();
    console.log("open issue selected");

  }

  public CreatePullRequest(){
    this.removeSelectedBtn();
    this.InputLabel = "Create Pull Request";
    this.selectedBtn = "pr-btn";
    this.addSelectBtn();
    console.log("create pull request selected");

  }

  public OpenMoreInfo(){
    console.log("more info selected");
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
    (<HTMLElement>document.getElementById(this.selectedBtn)).classList.add('selected');
  }

  protected removeSelectedBtn(){
    (<HTMLElement>document.getElementById(this.selectedBtn)).classList.remove('selected');
  }

}
