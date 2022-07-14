import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
    // Service message commands

    public AssignEnterprisePath(path: string) {
        this.emitEnterprisePath.next(path);
    }

    //  API Methods

    //  Helpers
}
