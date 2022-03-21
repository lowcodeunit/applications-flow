import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PalettePickerService } from '@lowcodeunit/lcu-theme-builder-common';
import { HttpClient } from '@angular/common/http';

declare var Sass: any;

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
    protected http: HttpClient,
    protected palettePickerService: PalettePickerService
  ) { }

  public ngOnInit(): void {

  }

  public DisplayDetails(): void {
    console.log('DisplayDetails()');

  }
}
