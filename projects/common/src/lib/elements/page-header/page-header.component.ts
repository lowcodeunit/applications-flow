import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
    public IsSmScreen: boolean;

    constructor(public breakpointObserver: BreakpointObserver) {}

    public ngOnInit(): void {
        this.breakpointObserver
            .observe(['(max-width: 959px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.IsSmScreen = true;
                } else {
                    this.IsSmScreen = false;
                }
            });
    }
}
