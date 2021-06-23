import { Component, Input, OnInit } from '@angular/core';
import { FormCardActionsModel } from '../../models/form-card-actions.model';

@Component({
  selector: 'lcu-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})

export class FormCardComponent implements OnInit {

  @Input('actions')
  public Actions: Array<FormCardActionsModel>;

  @Input('title')
  public Title: string;

  @Input('title-icon')
  public TitleIcon: string;

  @Input('sub-title')
  public SubTitle: string;

  constructor() { }

  ngOnInit(): void {
  }

}
