import { Component, OnInit, AfterViewInit, Input, } from '@angular/core';

@Component({
  selector: 'lcu-git-auth',
  templateUrl: './git-auth.component.html',
  styleUrls: ['./git-auth.component.scss'],
})
export class GitAuthComponent implements OnInit, AfterViewInit {

  @Input('size')
  public Size: string;
  //  Properties
  public ConnectClicked: boolean;

  //  Constructors
  constructor() {
    this.Size='large'
  }

  //  Life Cycle
  public ngAfterViewInit(): void {}

  public ngOnInit(): void {}

  /**
   * Connect Github Provider
   */
  public ConnectGitHubProvider(): void {
    const reidrectUri = location.pathname + location.search;

    // window.location.href = `/.oauth/GitHubOAuth?redirectUri=${reidrectUri}`;

    // added below line for the new social ui redirectUri wasn't working

    window.location.href = '/.oauth/GitHubOAuth?redirectUri=%2Fdashboard';


    this.ConnectClicked = true;
  }

  /**
   * Listen for State changes
   */
}
