import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcu-project-info-card',
  templateUrl: './project-info-card.component.html',
  styleUrls: ['./project-info-card.component.scss']
})
export class ProjectInfoCardComponent implements OnInit {

  @Input('project')
  public Project: any;



  constructor() { }

  ngOnInit(): void {
  }

}
