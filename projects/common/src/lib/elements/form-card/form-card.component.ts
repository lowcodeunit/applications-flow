import { Component, Input, OnInit } from '@angular/core';
import { FormActionsModel } from '../../models/form-actions.model';
@Component({
  selector: 'lcu-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})

export class FormCardComponent implements OnInit {

  @Input('form-actions')
  public FormActions: FormActionsModel;

  @Input('title')
  public Title: string;

  @Input('title-icon')
  public TitleIcon: string;

  @Input('sub-title')
  public Subtitle: string;

  constructor() { }

  ngOnInit(): void {
  }

}
