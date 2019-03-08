import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
// import { DataShareService } from '../../shared/services/data-share.service';
// import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// import * as $ from 'jquery';

// import { QMessageKit } from "lib/qchat/messagekit";


@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css'],
	host: { '[style.display]': 'conversationDisplay' }
})
export class ConversationComponent /*implements OnInit*/ {
	// @Output() private audioCallRequest = new EventEmitter<any>();

	public conversationDisplay = "unset";

	// private _messageForm: FormGroup;

	private _user = null;
	private _messages = [
		{
			sender: "samax.w1",
			receiver: "you",
			is_group: false,
			message: "hi"
		},
		{
			sender: "samax.w2",
			receiver: "you",
			is_group: false,
			message: "hello"
		},
		{
			sender: "samax.w1",
			receiver: "you",
			is_group: false,
			message: "kamon aso?"
		},
		{
			sender: "samax.w2",
			receiver: "you",
			is_group: false,
			message: "valo"
		},
	];

	private _selectedUser = null;
	private _chatTypeSwitcher: (user: any) => void = () => {
		console.warn("call type switcher never set");
	};

	// private _selectedGroup = null;

	// public selectedGroupUsers: string = '';

	// public progress;
	// public imgurl = [];
	// closeResult: string;

	// attachmentList: any = [];


	// modalRef: any;

	// callDialogEnabled = false;

	// @Output() private openDetails = new EventEmitter<boolean>();
	// @ViewChild('messageThread') private messageContainer: ElementRef;

	// constructor(
	// 	private cdr: ChangeDetectorRef,
	// 	// private modalService: NgbModal,
	// 	private fb: FormBuilder,
	// 	private router: Router,
	// 	// private dataShareService: DataShareService
	// ) {
	// 	var messageIsValid = (control: FormControl): ValidationErrors | null => {
	// 		var msg = control.value;
	// 		var ok = false;
	// 		switch (msg) {
	// 			case "":
	// 			case null:
	// 				ok = false;
	// 				break;
	// 			default: ok = (msg + "").trim().length > 0;
	// 		}
	// 		return ok ? null : { invalid_message: true };
	// 	}

	// 	this._messageForm = new FormGroup({
	// 		'message': new FormControl(
	// 			"", [Validators.required, messageIsValid]
	// 		)
	// 	});
	// 	$(document).ready(() => {
	// 		$('.message-editor').on('keypress', e => {
	// 			if (e.keyCode === 13) e.preventDefault();
	// 		});
	// 	})
	// }

	// ngOnInit() {
	// 	this.dataShareService.selectedUser.subscribe((user) => {
	// 		if (user !== null) {
	// 			this._selectedUser = user;
	// 		}
	// 	});
	// }

	setUser(user: any) {
		this._user = user;
	}

	setChatTypeSwitcher(switcher: (user: any) => void) {
		this._chatTypeSwitcher = switcher;
	}

	// updateUser(user: any) { this._selectedUser = user; }

	// sendMessage(messageData, isvalid) {
	// 	if (!isvalid) return;

	// 	// QMessageKit.get(
	// 	// 	this._selectedUser.id
	// 	// ).then(msgkit => {
	// 	// 	var message = {
	// 	// 		sender: msgkit.localUser(),
	// 	// 		receiver: this._selectedUser.id,
	// 	// 		is_group: this._selectedUser.is_group ? true : false,
	// 	// 		message: messageData.message.trim()
	// 	// 	};

	// 	// 	msgkit.sendMessage(JSON.stringify(message));
	// 	// 	this.updateMessages(message);
	// 	// }).catch(err => {
	// 	// 	console.error(err);
	// 	// });
	// }

	// updateMessages(message: any): void {
	// 	this._messageForm.disable();
	// 	this._messages.push(message);
	// 	this.cdr.detectChanges();
	// 	this._messageForm.reset();
	// 	this._messageForm.enable();
	// 	this.scrollMessageContainer();
	// }

	// scrollMessageContainer(): void {
	// 	if (this.messageContainer === undefined) return;

	// 	try {
	// 		var topPos = this.messageContainer.nativeElement.scrollHeight;
	// 		setTimeout(() => {
	// 			this.messageContainer.nativeElement.scrollTop = topPos;
	// 		}, 100);
	// 	} catch (error) { console.warn(error); }
	// }

	// alignMessage(userId: number): boolean {
	// 	return this._componentId === userId ? false : true;
	// }

	// selectedGroupUser(member) {
	// 	// this.selectedUserName = member.username;
	// 	// this.selectedUserId = member.id;
	// 	this.dataShareService.changeSelectedUser(member);
	// 	this.modalRef.close();
	// }

	// openDetailsAction() {
	// 	this.openDetails.emit(true);
	// }

	// openGroupDetails(groupDetails, userDetails) {
	// 	if (userDetails.is_group) {
	// 		this._selectedGroup = userDetails;
	// 	}
	// 	this.modalRef = this.modalService.open(groupDetails, {
	// 		backdrop: 'static', windowClass: "custom-modal"
	// 	});
	// 	this.modalRef.result.then((result) => {
	// 		this.closeResult = `Closed with: ${result}`;
	// 	}, (reason) => {
	// 		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	// 	});
	// }

	// makeAudioCallRequest(username) {
	// 	this.dataShareService.callRequestOfMessangerComponent(username);
	// }
	// cancelAudioCall() {
	// 	this.callDialogEnabled = false;
	// }

	// private getDismissReason(reason: any): string {
	// 	if (reason === ModalDismissReasons.ESC) {
	// 		return 'by pressing ESC';
	// 	} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	// 		return 'by clicking on a backdrop';
	// 	} else {
	// 		return `with: ${reason}`;
	// 	}
	// }
}
