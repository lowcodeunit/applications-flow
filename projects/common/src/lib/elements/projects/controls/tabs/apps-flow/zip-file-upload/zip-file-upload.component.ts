// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ZipAppOption } from '../../state/data-apps-management.state';

// @Component({
//   selector: 'lcu-zip-file-upload',
//   templateUrl: './zip-file-upload.component.html',
//   styleUrls: ['./zip-file-upload.component.scss'],
// })
// export class ZipFileUploadComponent implements OnInit {
//   //  Fields

//   //  Properties
//   @Input('form-group')
//   public FormGroup: FormGroup;

//   @Output('upload-zip-files')
//   public UploadZipFiles: EventEmitter<FileList>;

//   @Input('zip-app-options')
//   public ZipAppOptions: ZipAppOption[];

//   @Input('zip-file')
//   public ZipFile: string;

//   //  Constructors
//   constructor() {
//     this.UploadZipFiles = new EventEmitter<FileList>();
//   }

//   //  Life Cycle
//   public ngOnDestroy(): void {
//     this.FormGroup.removeControl('zipFile');
//   }

//   public ngOnInit(): void {
//     this.FormGroup.addControl(
//       'zipFile',
//       new FormControl(this.ZipFile || '', [
//         Validators.required,
//       ])
//     );
//   }

//   //  API Methods
//   public OnFileChange(event: any) {
//     const files = event.target.files;

//     this.emitUploadZipFiles(files);
//   }

//   public OnFileDrop(event: DragEvent) {
//     const files = event.dataTransfer.files;

//     this.emitUploadZipFiles(files);
//   }

//   //  Helpers

//   public emitUploadZipFiles(files: FileList) {
//     if (files.length > 0) {
//       this.UploadZipFiles.emit(files);
//     }
//   }
// }
