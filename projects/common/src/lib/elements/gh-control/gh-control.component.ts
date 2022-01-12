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

  }

  public OpenIssue(){
    this.removeSelectedBtn();
    this.InputLabel = "Open Issue";
    this.selectedBtn = "oi-btn";
    this.addSelectBtn();

  }

  public CreatePullRequest(){
    this.removeSelectedBtn();
    this.InputLabel = "Create Pull Request";
    this.selectedBtn = "pr-btn";
    this.addSelectBtn();

  }

  protected addSelectBtn(){    
    (<HTMLElement>document.getElementById(this.selectedBtn)).classList.add('selected');
  }

  protected removeSelectedBtn(){
    (<HTMLElement>document.getElementById(this.selectedBtn)).classList.remove('selected');
  }

}
