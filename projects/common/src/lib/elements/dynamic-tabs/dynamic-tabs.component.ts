import { FormsService } from './../../services/forms.service';
import { Subscription } from 'rxjs';
import { DynamicTabsModel } from './../../models/dynamic-tabs.model';
import { 
  AfterViewInit, 
  Component, 
  Input, 
  OnInit, 
  ViewChild, 
  ViewContainerRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'lcu-dynamic-tabs',
  templateUrl: './dynamic-tabs.component.html',
  styleUrls: ['./dynamic-tabs.component.scss']
})

export class DynamicTabsComponent implements OnInit, AfterViewInit {

  /**
   * Container used to display dynamic components
   */
  @ViewChild('container', {read: ViewContainerRef, static: false})
  protected viewContainer: ViewContainerRef;

  @Input('background-color')
  public BackgroundColor: string;

  @Input('color')
  public Color: string;

  /**
   * Form is dirty flag
   */
  public FormIsDirty: boolean;

  /**
   * Listener for when any form is dirty
   */
  protected formIsDirtySubscription: Subscription;

  /**
   * Components loaded as dynamic components
   */ 
  @Input('tab-components')
  public TabComponents: Array<DynamicTabsModel>;

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected formsService: FormsService) { }

  // Lifecycle hook
  public ngOnInit(): void {

    // listen form any form to be dirty, then disable all tabs except for the current tab
    this.formIsDirtySubscription = this.formsService.FormIsDirty.subscribe(
      (val: boolean) => {
        this.FormIsDirty = val;
    });
  }

  public ngAfterViewInit(): void {
    this.renderComponent(0);
  }

  /**
   * Tab change event
   *
   * @param index selected tab index
   */
  public TabChanged(evt: MatTabChangeEvent): void {

    setTimeout(() => {
        this.renderComponent(evt.index);
    }, 1000);
  }

  /**
   * Render component for the active tab
   *
   * @param index TabComponents index position
   */
  protected renderComponent(index: number) {

      if (!this.TabComponents) {
        return;
      }
      const componentRef = this.viewContainerRef.createComponent(this.TabComponents[index].Component);

      // factory for creating a dynamic component
      // const factory: ComponentFactory<any> = this.componentFactoryResolver
      // .resolveComponentFactory(this.TabComponents[index].Component);

      // component created by a factory
      // const componentRef: ComponentRef<any> = this.viewContainer.createComponent(factory);

      // current component instance
      const instance: DynamicTabsComponent = componentRef.instance as DynamicTabsComponent;

      // find the current component in TabComponents and set its data
      this.TabComponents.find((comp: DynamicTabsModel) => {
        if (comp.Component.name === instance.constructor.name) {
          instance['Data'] = comp.Data;
        }
      });
  }
}
