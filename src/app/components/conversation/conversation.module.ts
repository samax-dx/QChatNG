import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { FormSupportModule } from './../../../modules/form-support/form-support.module';
// import {FileUploadModule} from 'ng2-file-upload';
import { ConversationComponent } from './conversation.component';
// import { MediaPreviewDirective } from '../../../directives/media-preview.directive';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		// FormSupportModule,
		// FileUploadModule,
		// NgbDropdownModule.forRoot()
	],
	declarations: [
		ConversationComponent,
		// MediaPreviewDirective
	],
	exports: [
		ConversationComponent
	]
})
export class ConversationModule { }
