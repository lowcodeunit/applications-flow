import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-project-info-card',
    templateUrl: './project-info-card.component.html',
    styleUrls: ['./project-info-card.component.scss'],
})
export class ProjectInfoCardComponent implements OnInit {
    @Input('app')
    public App?: EaCApplicationAsCode;

    @Input('description')
    public Description: string;

    @Input('image')
    public Image: string;

    @Input('is-editable')
    public IsEditable: boolean;

    @Input('is-shareable')
    public IsShareable: boolean;

    @Input('loading')
    public Loading: boolean;

    @Input('name')
    public Name: string;

    @Input('subtext')
    public Subtext: string;

    @Input('version')
    public Version: string;

    @Output('left-click-event')
    public LeftClickEvent: EventEmitter<{}>;

    @Output('right-click-event')
    public RightClickEvent: EventEmitter<{}>;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected dialog: MatDialog) {
        this.LeftClickEvent = new EventEmitter();

        this.RightClickEvent = new EventEmitter();

        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {}

    public ngOnChanges() {}

    public DisplayVersion(): boolean {
        if (this.Version) {
            if (this.App?.LowCodeUnit?.Type.toLowerCase() === 'zip') {
                return false;
            } else if (this.App?.Processor?.Type.toLowerCase() !== 'dfs') {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    public LeftIconClicked() {
        this.LeftClickEvent.emit({});
    }

    public RightIconClicked() {
        // console.log('share clicked');
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
