import { Injectable, Injector } from '@angular/core';
import { StateContext } from '@lcu/common';
import { LcuManagementState } from './lcu-management.state';

@Injectable({
    providedIn: 'root'
})
export class LcuManagementStateContext extends StateContext<LcuManagementState> {

    // Constructors
    constructor(protected injector: Injector) {
        super(injector);
    }

    
    // API Methods
    public GetLcuById(id: number): void {
        this.Execute({
            Arguments: {
                LcuId: id
            },
            Type: 'GetLcuById'
        });
    }

    //  Helpers
    protected defaultValue() {
        return { Loading: true } as LcuManagementState;
    }
    
    protected loadStateKey(): string {
        return 'main';
    }

    protected loadStateName(): string {
        return 'lcu';
    }
}
