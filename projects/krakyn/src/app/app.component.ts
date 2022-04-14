import { Component } from '@angular/core';

@Component({
    selector: 'lcu-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'krakyn';

    public ReturnToDashboard() {
        window.location.href = '/dashboard';
    }
}
