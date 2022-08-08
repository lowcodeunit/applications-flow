import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-slotted-card',
    templateUrl: './slotted-card.component.html',
    styleUrls: ['./slotted-card.component.scss'],
})
export class SlottedCardComponent implements OnInit {
    @Input('action-text')
    public ActionText: string;

    @Input('action-path')
    public ActionPath: string;

    @Input('button-text')
    public ButtonText: string;

    @Input('icon')
    public Icon: string;

    @Input('loading')
    public Loading: boolean;

    @Input('main-slot-description')
    public MainSlotDescription: string;

    @Input('main-icon')
    public MainIcon: string;

    @Input('show-main-icon')
    public ShowMainIcon: boolean;

    @Input('card-title')
    public CardTitle: string;

    @Input('secondary-slot-description')
    public SecondarySlotDescription: string;

    @Output('main-action-clicked')
    public MainActionClicked: EventEmitter<{}>;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService) {
        this.MainActionClicked = new EventEmitter();
        this.SkeletonEffect = 'wave';

        this.MainIcon = 'add';

        this.ShowMainIcon = true;
    }

    public ngOnInit(): void {}

    public MainActionClickEvent() {
        this.MainActionClicked.emit({});
    }
}
