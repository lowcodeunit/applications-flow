import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IoTEnsembleState } from '../state/iot-ensemble.state';
import { LCUServiceSettings } from '@lcu/common';

@Injectable({
    providedIn: 'root',
})
export class IoTEnsembleService {
    //  Fields
    protected apiRoot: string;

    //  Properties
    public State: IoTEnsembleState;

    //  Constructors
    constructor(
        protected http: HttpClient,
        protected settings: LCUServiceSettings
    ) {
        this.apiRoot = settings.APIRoot;

        this.State = new IoTEnsembleState();
    }

    //  API Methods
    public ColdQuery(): Observable<object> {
        return this.http.get(`${this.apiRoot}/api/lowcodeunit/iot/cold-query`, {
            headers: this.loadHeaders(),
        });
    }

    public ToggleEmulatedEnabled(): Observable<object> {
        return this.http.get(`${this.apiRoot}/api/lowcodeunit/userfeed`, {
            headers: this.loadHeaders(),
        });
    }

    //  Helpers
    protected loadHeaders(): { [header: string]: string | string[] } {
        return {};
    }
}
