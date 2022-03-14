import { Component, OnInit, AfterViewInit, } from '@angular/core';

@Component({
  selector: 'lcu-git-auth',
  templateUrl: './git-auth.component.html',
  styleUrls: ['./git-auth.component.scss'],
})
export class GitAuthComponent implements OnInit, AfterViewInit {
  //  Properties
  public ConnectClicked: boolean;

  //  Constructors
  constructor() {}

  //  Life Cycle
  public ngAfterViewInit(): void {}

  public ngOnInit(): void {}

  /**
   * Connect Github Provider
   */
  public ConnectGitHubProvider(): void {
    const reidrectUri = location.pathname + location.search;

    window.location.href = `/.oauth/GitHubOAuth?redirectUri=${reidrectUri}`;

    this.ConnectClicked = true;
  }

  /**
   * Listen for State changes
   */
}
