import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWizardCardComponent } from './project-wizard-card.component';

describe('ProjectWizardCardComponent', () => {
    let component: ProjectWizardCardComponent;
    let fixture: ComponentFixture<ProjectWizardCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProjectWizardCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectWizardCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
