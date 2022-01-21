import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'projects/common/src/lib/services/project.service';
import { ApplicationsFlowState } from '@lowcodeunit/applications-flow-common';

@Component({
  selector: 'lcu-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  public routeData: any;

  public Routes: any;

  public Stats: any[];

  public State: ApplicationsFlowState;

  protected carouselIndex: number;

  //TODO hook this up properly
  public get Application(): any{
    return this.State?.EaC?.Projects[this.routeData.applicationLookup] || {};
  }

  constructor(private router: Router,
    protected projectService: ProjectService) {

   this.State = new ApplicationsFlowState();

   this.routeData = this.router.getCurrentNavigation().extras.state;

   this.Stats = [{Name: "Retention Rate", Stat: "85%"}, 
   {Name: "Bounce Rate", Stat: "38%"}, 
   {Name: "Someother Rate", Stat: "5%"}];

   this.carouselIndex = 0;

  }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => {});
    
    console.log("route Data: ", this.routeData); 

  }

  public ngAfterViewInit(){
    this.buildCarousel();
  }


  public LaunchRouteClicked(){
    console.log("Launch Route clicked");
  }

  public EditRouteClicked(){
    console.log("Edit Route clicked");
  }

  public UploadRouteClicked(){
    console.log("Upload Route clicked");
  }

  public TrashRouteClicked(){
    console.log("Trash Route clicked");
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
