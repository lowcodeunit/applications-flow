import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public ThemeClass: BehaviorSubject<string>;
  public Themes: Array<any>;
  public Title = 'LCU-Starter-App';

  constructor(
  ) { }

  public ngOnInit(): void {
  }
}
