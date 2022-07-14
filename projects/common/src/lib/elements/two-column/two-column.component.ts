import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-two-column',
    templateUrl: './two-column.component.html',
    styleUrls: ['./two-column.component.scss'],
})
export class TwoColumnComponent implements OnInit {
    public SmallScreen: boolean;

    constructor(public breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {
        this.breakpointObserver
            .observe(['(max-width: 850px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.SmallScreen = true;
                } else {
                    this.SmallScreen = false;
                }
            });
    }
}
