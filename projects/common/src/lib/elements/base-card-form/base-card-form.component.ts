import { FormActionsModel } from './../../models/form-actions.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'lcu-base-card-form',
  templateUrl: './base-card-form.component.html',
  styleUrls: ['./base-card-form.component.scss']
})

export abstract class BaseCardFormComponent implements OnInit {

  /**
   * Form button actions
   */
  public Actions: FormActionsModel;

  /**
   * FormGroup for project name card
   */
  public Form: FormGroup;

  /**
   * Card icon
   */
  public Icon: string;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Clear form
   */
   protected clearForm(): void {
    this.Form.reset();
  }

  /**
   * Save form
   */
  protected save(): void {
    
  }

  /**
   * Listen to form changes
   */
  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: any) => {

    });
  }

}
