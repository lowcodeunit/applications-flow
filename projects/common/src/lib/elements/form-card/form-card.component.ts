import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CardFormConfigModel } from '../../models/card-form-config.model';
import { FormActionsModel } from '../../models/form-actions.model';
@Component({
    selector: 'lcu-form-card',
    templateUrl: './form-card.component.html',
    styleUrls: ['./form-card.component.scss'],
})
export class FormCardComponent implements OnInit {
    /**
     * Values for building out the card
     */
    @Input('config')
    public Config: CardFormConfigModel;

    /**
     * Disable everything
     */
    @Input('disabled')
    public Disabled: boolean;

    @Input('is-dirty')
    public IsDirty: boolean;

    /**
     * Form
     */
    @Input('form')
    public Form: FormGroup;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        if (this.Config) {
            // console.log('recieved Config: ', this.Config);
        }
    }
}
