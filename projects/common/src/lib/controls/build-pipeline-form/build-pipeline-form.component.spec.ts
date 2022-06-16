import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPipelineFormComponent } from './build-pipeline-form.component';

describe('BuildPipelineFormComponent', () => {
    let component: BuildPipelineFormComponent;
    let fixture: ComponentFixture<BuildPipelineFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BuildPipelineFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildPipelineFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
