import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApplicationsFlowState } from '../state/applications-flow.state';

@Injectable({
    providedIn: 'root',
})
export class SocialUIService {
    //  Fields

    //  Properties

    //  Constructors
    constructor() {}

    // Observable string sources
    private emitEnterprisePath = new Subject<any>();

    // Observable string streams
    changeEmitted$ = this.emitEnterprisePath.asObservable();

    // private emitStateChanges = new Subject<ApplicationsFlowState>();
    // stateChangeEmitted$ = this.emitStateChanges.asObservable();

    // Service message commands

    public AssignEnterprisePath(path: string) {
        this.emitEnterprisePath.next(path);
    }

    // public UpdateState(state: ApplicationsFlowState){
    //     this.emitStateChanges.next(state);
    // }

    //  API Methods

    //  Helpers
}
