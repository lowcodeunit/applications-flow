import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNameComponent } from './project-details.component';

describe('ProjectNameComponent', () => {
    let component: ProjectNameComponent;
    let fixture: ComponentFixture<ProjectNameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProjectNameComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
