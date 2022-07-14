import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-project-wizard-card',
    templateUrl: './project-wizard-card.component.html',
    styleUrls: ['./project-wizard-card.component.scss'],
})
export class ProjectWizardCardComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.iframeLoaded();
    }

    public iframeLoaded() {
        console.log('hello');
        var iFrameID = document?.querySelector('#wizard') as HTMLIFrameElement;
        if (iFrameID) {
            iFrameID.style.height = '0px';
        }

        // setTimeout(() => {

        //     // console.log("header = ",iFrameID.contentWindow.document.body.getElementsByClassName('css-3gkkwt') )

        //     const els = iFrameID.contentWindow.document.body.getElementsByClassName('css-3gkkwt');
        //     if (els.length > 0) {
        //         els[0].setAttribute("style","display:none;");
        //     }

        // }, 2000)

        setTimeout(() => {
            if (iFrameID) {
                const els =
                    iFrameID.contentWindow.document.body.getElementsByClassName(
                        'css-3gkkwt'
                    );
                if (els.length > 0) {
                    els[0].setAttribute('style', 'display:none;');
                }
                // here you can make the height, I delete it first, then I make it again
                iFrameID.style.height = '';
                iFrameID.style.height =
                    iFrameID.contentWindow.document.body.offsetHeight +
                    40 +
                    'px';
            }
        }, 6000);
    }
}
