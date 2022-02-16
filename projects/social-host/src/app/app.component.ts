import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LCUServiceSettings } from '@lcu/common';
import { ApplicationsFlowState, EaCService } from '@lowcodeunit/applications-flow-common';
import { PalettePickerService, ThemeBuilderConstants, ThemeBuilderService, ThemePickerModel } from '@lowcodeunit/lcu-theme-builder-common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

declare var Sass: any;

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'social-host';

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public ThemeClass: BehaviorSubject<string>;
  public Themes: Array<any>;

  constructor(
    protected serviceSettings: LCUServiceSettings,
    protected eacSvc: EaCService,
    protected http: HttpClient,
    protected themeBuilderService: ThemeBuilderService,
    protected palettePickerService: PalettePickerService
  ) {
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
    // this.themeBuilderService.MaterialTheme = 'https://www.iot-ensemble.com/assets/theming/theming.scss';
    this.themeBuilderService.MaterialTheme = './assets/test.scss';

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
    ];

    this.themeBuilderService.SetThemes(themes);
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();

    await this.eacSvc.ListEnterprises();

    if (this.State.Enterprises?.length > 0) {
      await this.eacSvc.GetActiveEnterprise();
    }

  }
}
