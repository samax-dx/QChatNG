import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessangerRoutingModule } from './messanger-routing.module';
import { MessangerComponent } from './messanger.component';
// import { PageHeaderModule } from '../../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { ConversationModule } from './conversation/conversation.module';
// import { ChatListModule } from './../chat-list/chat-list.module';
import { ConversationComponent } from './../conversation/conversation.component';
import { ContactListModule } from '../contact-list/contact-list.module';
import { NgtProviderComponent } from 'src/app/shared/components/ngt-provider/ngt-provider.component';


@NgModule({
    imports: [
        // ConversationModule,
        // ChatListModule,
        ContactListModule,
        CommonModule,
        MessangerRoutingModule,
        // PageHeaderModule, 
        FormsModule,
        // ReactiveFormsModule,NgbModule.forRoot()
    ],
    declarations: [NgtProviderComponent, MessangerComponent, ConversationComponent],
    entryComponents: [ConversationComponent]
})
export class MessangerModule { }
