import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationsFlowState,
  EaCService,
  ApplicationsFlowService,
  NewApplicationDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import { LazyElementConfig, LazyElementToken } from '@lowcodeunit/lazy-element';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.scss'],
})
export class IoTComponent implements OnInit {
  public Context: Object;

  public IoTConfig: LazyElementConfig;

  public get IoTElementHTML(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`<${this.IoTConfig.ElementName}></${this.IoTConfig.ElementName}>`)
  }

  constructor(protected sanitizer: DomSanitizer) {
    this.IoTConfig = {
      Scripts: [
        '/_lcu/lcu-device-data-flow-lcu/wc/lcu-device-data-flow.lcu.js',
      ],
      Styles: [
        '/_lcu/lcu-device-data-flow-lcu/wc/lcu-device-data-flow.lcu.css',
      ],
      ElementName: 'lcu-device-data-flow-manage-element',
    };
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  //  Helpers
  protected async handleStateChange(): Promise<void> {
    this.loadScripts();

    this.loadStyles();
  }
  
  protected loadScripts() {
    for (let script of this.IoTConfig.Scripts) {
      let node = document.createElement('script'); // creates the script tag
      node.src = script; // sets the source (insert url in between quotes)
      node.type = 'text/javascript'; // set the script type
      node.async = true; // makes script run asynchronously
      node.charset = 'utf-8';
      // append to head of document
      document.getElementsByTagName('head')[0].appendChild(node); 
    }
  }
  
  protected loadStyles() {
    for (let style of this.IoTConfig.Styles) {
      let node = document.createElement('link'); // creates the script tag
      node.href = style; // sets the source (insert url in between quotes)
      node.type = 'text/css'; // set the script type
      // append to head of document
      document.getElementsByTagName('head')[0].appendChild(node); 
    }
  }
}
