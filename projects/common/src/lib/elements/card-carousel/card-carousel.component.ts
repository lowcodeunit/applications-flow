import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-card-carousel',
  templateUrl: './card-carousel.component.html',
  styleUrls: ['./card-carousel.component.scss']
})
export class CardCarouselComponent implements OnInit {

  @Input('stats')
  public Stats: any[];

  protected carouselIndex: number;

  constructor() { 
    this.carouselIndex = 0;
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit(){
    this.assignCarouselClass();
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

    public MoreDetailsClicked(){
      console.log("More details clicked on carousel item", this.Stats[this.carouselIndex]);
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

}
