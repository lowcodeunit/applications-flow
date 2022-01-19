import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'projects/common/src/lib/services/project.service';
import { ApplicationsFlowState } from '@lowcodeunit/applications-flow-common';
import { MainFeedItemModel } from 'projects/common/src/lib/models/main-feed-item.model';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public FeedItems: MainFeedItemModel[];

  public routeData: any;

  public Stats: any[];

  public State: ApplicationsFlowState;

  protected carouselIndex: number;

  public get Project(): any{
    return this.State?.EaC?.Projects[this.routeData.projectLookup] || {};
  }

  public get NumberOfRoutes(): number{
    return this.ApplicationLookups.length;
  }



  public get ApplicationLookups(): string[]{
    return Object.keys(this.Project.ApplicationLookups || {});
  }

  public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    return this.State?.EaC?.Applications || {};
  }

  public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    this.Project.ApplicationLookups.forEach((appLookup: string) => {
      apps[appLookup] = this.ApplicationsBank[appLookup];
    });
    return apps;
  }

  
  public get RoutedApplications(): {
    [route: string]: { [lookup: string]: EaCApplicationAsCode };
  } {
    const appLookups = Object.keys(this.Applications);

    const apps = appLookups.map((appLookup) => this.Applications[appLookup]);

    let appRoutes =
      apps.map((app) => {
        return app.LookupConfig?.PathRegex.replace('.*', '');
      }) || [];

    appRoutes = appRoutes.filter((ar) => ar != null);

    let routeBases: string[] = [];

    appRoutes.forEach((appRoute) => {
      const appRouteParts = appRoute.split('/');

      const appRouteBase = `/${appRouteParts[1]}`;

      if (routeBases.indexOf(appRouteBase) < 0) {
        routeBases.push(appRouteBase);
      }
    });

    let workingAppLookups = [...(appLookups || [])];

    routeBases = routeBases.sort((a, b) => b.localeCompare(a));

    const routeSet =
      routeBases.reduce((prevRouteMap, currentRouteBase) => {
        const routeMap = {
          ...prevRouteMap,
        };

        const filteredAppLookups = workingAppLookups.filter((wal) => {
          const wa = this.Applications[wal];

          return wa.LookupConfig?.PathRegex.startsWith(currentRouteBase);
        });

        routeMap[currentRouteBase] =
          filteredAppLookups.reduce((prevAppMap, appLookup) => {
            const appMap = {
              ...prevAppMap,
            };

            appMap[appLookup] = this.Applications[appLookup];

            return appMap;
          }, {}) || {};

        workingAppLookups = workingAppLookups.filter((wa) => {
          return filteredAppLookups.indexOf(wa) < 0;
        });

        return routeMap;
      }, {}) || {};

    let routeSetKeys = Object.keys(routeSet);

    routeSetKeys = routeSetKeys.sort((a, b) => a.localeCompare(b));

    const routeSetResult = {};

    routeSetKeys.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

    return routeSetResult;
  }
  
  
  constructor(private router: Router,
     protected projectService: ProjectService) {

    this.State = new ApplicationsFlowState();

    this.routeData = this.router.getCurrentNavigation().extras.state;

    this.Stats = [{Name: "Retention Rate", Stat: "85%"}, 
    {Name: "Bounce Rate", Stat: "38%"}, 
    {Name: "Someother Rate", Stat: "5%"}];

    this.FeedItems = [{Title: "Test Issue", Author: "Jackson", Type: "ISSUE"}, 
    {Title: "Test Build", Author: "Mike", Type: "BUILD"}];

    this.carouselIndex = 0;

   }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => {});
    
    console.log("route Data: ", this.routeData); 

  }

  public ngAfterViewInit(){
    this.buildCarousel();
  }

  public HandleLeftClickEvent(event: any){
    console.log("Left Icon has been selected", event);
  }

  public HandleRightClickEvent(event: any){
    console.log("Right Icon has been selected", event);
  }

  public SettingsClicked(){
    console.log("Settings Clicked")
  }

  public UpgradeClicked(){
    console.log("Upgarde clicked");
  }

  public LaunchBuildClicked(){
    console.log("launch build clicked");
  }

  public ViewBuildDetails(){
    console.log("View build details clicked");
  }

  public LeftChevronClicked(){


  this.removeCarouselClasses();

    if(this.carouselIndex === 0){
      this.carouselIndex = this.Stats.length-1;
    }
    else{
      this.carouselIndex--;
    }

  this.assignCarouselClass();

  }

  public RightChevronClicked(){
    this.removeCarouselClasses();

    if(this.carouselIndex === this.Stats.length-1){
      this.carouselIndex = 0;
    }
    else{
      this.carouselIndex++;
    }

  this.assignCarouselClass();
  }

  //HELPERS

  protected removeCarouselClasses(){
    for(let i=0; i<this.Stats.length; i++){
      if(i === this.carouselIndex){
        (<HTMLElement>document.getElementById("carousel-"+this.carouselIndex)).classList.remove('active');
      }
      else{
        (<HTMLElement>document.getElementById("carousel-"+i)).classList.remove('hidden');
      }
    }
  }

  protected assignCarouselClass(){
    for(let i=0; i<this.Stats.length; i++){
      if(i === this.carouselIndex){
        (<HTMLElement>document.getElementById("carousel-"+this.carouselIndex)).classList.add('active');
      }
      else{
        (<HTMLElement>document.getElementById("carousel-"+i)).classList.add('hidden');
      }
    }
  }

  protected buildCarousel(){
    this.assignCarouselClass();
  }


  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {
      await this.projectService.GetActiveEnterprise(this.State);
    }

  }

}
