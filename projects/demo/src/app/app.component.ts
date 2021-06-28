import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PalettePickerService, ThemeBuilderConstants, ThemeBuilderService, ThemePickerModel } from '@lowcodeunit/lcu-theme-builder-common';
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
    protected themeBuilderService: ThemeBuilderService,
    protected palettePickerService: PalettePickerService
  ) { }

  public ngOnInit(): void {
    this.themeBuilderService.MaterialTheme = 'https://www.iot-ensemble.com/assets/theming/theming.scss';
    this.setupThemes();
  }


  /**
   * Setup array of themes
   */
   protected setupThemes(): void {
    const themes: Array<ThemePickerModel> = [
      new ThemePickerModel(
        {
          ID: 'Fathym Brand',
          Primary: ThemeBuilderConstants.document.getPropertyValue('--initial-primary'),
          Accent: ThemeBuilderConstants.document.getPropertyValue('--initial-accent'),
          Warn: ThemeBuilderConstants.document.getPropertyValue('--initial-warn')
        }
      ),
      new ThemePickerModel(
        {
          ID: 'Yellow', 
          Primary: '#ffcc11',
          Accent: '#06a5ff',
          Warn: '#990000'
        }
      ),
      new ThemePickerModel(
        {
          ID: 'Pink',
          Primary: '#a83271',
          Accent: '#6103ff',
          Warn: '#b9f013'
        }
      )
    ];

    this.themeBuilderService.SetThemes(themes);
  }

  public DisplayDetails(): void {
    console.log('DisplayDetails()');

  }
}
