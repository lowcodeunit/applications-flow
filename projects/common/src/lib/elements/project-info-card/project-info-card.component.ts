import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-project-info-card',
    templateUrl: './project-info-card.component.html',
    styleUrls: ['./project-info-card.component.scss'],
})
export class ProjectInfoCardComponent implements OnInit {
    @Input('description')
    public Description: string;

    @Input('image')
    public Image: string;

    @Input('icon')
    public Icon: string;

    @Input('is-editable')
    public IsEditable: boolean;

    @Input('is-shareable')
    public IsShareable: boolean;

    @Input('name')
    public Name: string;

    @Input('promo')
    public Promo: boolean;

    @Input('subtext')
    public Subtext: string;

    @Input('version')
    public Version: string;

    @Output('left-click-event')
    public LeftClickEvent: EventEmitter<{}>;

    @Output('right-click-event')
    public RightClickEvent: EventEmitter<{}>;

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected dialog: MatDialog) {
        this.LeftClickEvent = new EventEmitter();

        this.RightClickEvent = new EventEmitter();

        this.SkeletonEffect = 'wave';

        this.Promo = false;
    }

    public ngOnInit(): void {
        // console.log("loading = ", this.Loading)
        // console.log("is shareable: ", this.IsShareable);
        // console.log("is editable: ", this.IsEditable);
    }

    public LaunchBilling() {
        window.location.href = '/dashboard/billing';
    }

    public LeftIconClicked() {
        this.LeftClickEvent.emit({});
    }

    public RightIconClicked() {
        console.log('share clicked');
        this.RightClickEvent.emit({});
    }

    // public UpgradeClicked() {
    //     const dialogRef = this.dialog.open(UpgradeDialogComponent, {
    //         width: '600px',
    //         data: {},
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {
    //         // console.log('The dialog was closed');
    //         // console.log("result:", result)
    //     });
    // }
}
