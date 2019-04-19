import {
	Component,
	ComponentFactoryResolver,
	ComponentFactory,
	ViewContainerRef,
	ViewChild,
} from '@angular/core';

import { MessengerComponent } from '../messenger/messenger.component';
import { imkit } from 'lib/qchat/imkit';
import { IMKit } from 'lib/qchat/imkit/IMKit';
import { CallKit } from 'lib/qchat/callkit/CallKit';
import { callkit } from 'lib/qchat/callkit';

import * as $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/draggable';


@Component({
	selector: 'app-messanger',
	templateUrl: './messanger.component.html',
	styleUrls: ['./messanger.component.scss']
})
export class MessangerComponent {
	@ViewChild("messenger", { read: ViewContainerRef })
	messengerVCR: ViewContainerRef;
	private _messengerCF: ComponentFactory<MessengerComponent>;

	sidebar: "none" | "contacts" | "groups" = "contacts";

	shouldring = false;
	callinguserid: string | null = null;
	ondialogresult: ((result: "ok" | "cancel") => void) | null = null;

	activeuser: any = null;

	private _messengers: { [key: string]: MessengerComponent } = {};

	constructor(cfr: ComponentFactoryResolver) {
		this._messengerCF = cfr.resolveComponentFactory(MessengerComponent);

		IMKit.onmessage = (user_id, message) => {
			var messenger = this._messengers[user_id];
			if (messenger) messenger.onmessage(message);
		};
		imkit.init();

		CallKit.oncall = (user_id, videorequested, accept, reject) => {
			this.ondialogresult = result => {
				if (result === "ok") accept();
				else reject();
			};

			this.openRinger(user_id);

			return status => {
				this.closeRinger();
				if (!status) return;
				var messenger = this._messengers[user_id];
				messenger.oncall(videorequested);
			};
		};
		callkit.init();
	}

	openRinger(user_id: string) {
		this.shouldring = true;
		this.callinguserid = user_id;

		$(document).ready(function () {
			var dialog = $('.call-dialog-drag');
			dialog.draggable({
				handle: '.call-dialog-handle',
				containment: "parent"
			});

			var p = dialog.parent();
			dialog.css("top", (p.height() / 2 - dialog.height() / 2) + "px");
			dialog.css("left", (p.width() / 2 - dialog.width() / 2) + "px");
			dialog.css("visibility", "visible");
			dialog.css('cursor', 'move');
		});
	}

	closeRinger() {
		this.shouldring = false;
		this.callinguserid = null;
		this.ondialogresult = null;
	}

	openMessenger(user: any): void {
		this.activeuser = user;
		Object.keys(this._messengers).forEach(id => {
			this._messengers[id].hide();
		});

		var messenger = this._messengers[user.id];
		if (messenger) return messenger.show();

		messenger = this._messengers[user.id] = (
			this.messengerVCR.createComponent(this._messengerCF).instance
		);

		messenger.setUser(user);
		messenger.setSidebarViewer(sb_name => {
			if (sb_name) return this.sidebar = sb_name;

			if (!sb_name)
				if (this.sidebar === "none")
					return this.sidebar = "contacts";
		});

		messenger.init();
	}
}
