import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';

import * as $ from "jquery";
import { imkit } from 'lib/qchat/imkit';
import { UserKit } from 'lib/qchat/userkit/UserKit';


@Component({
	selector: 'app-imwidget',
	templateUrl: './imwidget.component.html',
	styleUrls: ['./imwidget.component.scss']
})
export class IMWidgetComponent {
	user: any;
	messages = [];
	messageForm: FormGroup;
	cancall: boolean = true;

	outboundcallstarter = (type: "audio" | "video") => console.warn(
		"NOP!! IMWidgetComponent.callstarter"
	);

	constructor(private _cdr: ChangeDetectorRef) {
		var messageIsValid = (control: FormControl): ValidationErrors | null => {
			var msg = control.value;
			var ok = false;
			switch (msg) {
				case "":
				case null:
					ok = false;
					break;
				default: ok = (msg + "").trim().length > 0;
			}
			return ok ? null : { invalid_message: true };
		}

		this.messageForm = new FormGroup({
			'message': new FormControl(
				"", [Validators.required, messageIsValid]
			)
		});
		$(document).ready(() => {
			$('.message-editor').on('keypress', e => {
				if (e.keyCode === 13) e.preventDefault();
			});
		})
	}

	sendMessage(messageData, isvalid?) {
		if (!isvalid) return;

		var message = {
			sender: UserKit.localuser,
			receiver: this.user.id,
			is_group: this.user.is_group ? true : false,
			message: messageData.message.trim()
		};
		imkit.sendmessage(this.user.id, message);
		this.updateMessages(message);
	}

	makeCall(type: "audio" | "video"): void {
		this.outboundcallstarter(type);
	}

	enableCallbar(): void { this.cancall = true; }
	disableCallbar(): void { this.cancall = false; }

	updateMessages(message: any): void {
		this.messageForm.disable();
		this.messages.push(message);
		//console.log(this.messages);
		this._cdr.detectChanges();
		this.messageForm.reset();
		this.messageForm.enable();
	}
}
