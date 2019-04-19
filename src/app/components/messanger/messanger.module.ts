import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessangerRoutingModule } from './messanger-routing.module';
import { MessangerComponent } from './messanger.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMWidgetComponent } from '../imwidget/imwidget.component';
import { CallWidgetComponent } from '../call-widget/call-widget.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { MessengerComponent } from '../messenger/messenger.component';


@NgModule({
    imports: [
        CommonModule,
        MessangerRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        MessangerComponent,
        IMWidgetComponent,
        CallWidgetComponent,
        ContactListComponent,
        MessengerComponent
    ],
    entryComponents: [CallWidgetComponent, IMWidgetComponent, MessengerComponent]
})
export class MessangerModule { }
