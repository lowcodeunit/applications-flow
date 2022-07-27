import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-three-column',
    templateUrl: './three-column.component.html',
    styleUrls: ['./three-column.component.scss'],
})
export class ThreeColumnComponent implements OnInit {
    public SmallScreen: boolean;

    public Layout: string;

    constructor(public breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {
        this.breakpointObserver
            .observe(['(max-width: 850px)'])
            .subscribe((state: BreakpointState) => {
                // console.log("Breakpoint: ", state.matches)
                if (state.matches) {
                    this.SmallScreen = true;
                    this.Layout = 'column';
                } else {
                    this.Layout = 'row';
                    this.SmallScreen = false;
                }
                // console.log("SmallScreen = " ,this.SmallScreen);
            });
    }

    // public Layout(): string{
    //     if(this.SmallScreen){
    //         // console.log("returning: col")
    //         return "column";
    //     }
    //     else{
    //         // console.log("returning: row")

    //         return "row";
    //     }
    // }
}
