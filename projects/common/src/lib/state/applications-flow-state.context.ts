import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import { ApplicationsFlowState } from './applications-flow.state';

@Injectable({
    providedIn: 'root',
})
export class ApplicationsFlowStateContext extends StateContext<ApplicationsFlowState> {
    // Constructors
    constructor(protected injector: Injector) {
        super(injector);
    }

    // API Methods
    public AddApplication(): void {
        this.Execute({
            Arguments: {},
            Type: 'AddApplication',
        });
    }

    //  Helpers
    protected defaultValue(): ApplicationsFlowState {
        return { Loading: true } as ApplicationsFlowState;
    }

    protected loadStateKey(): string {
        return 'main';
    }

    protected loadStateName(): string {
        return 'lcu';
    }
}
