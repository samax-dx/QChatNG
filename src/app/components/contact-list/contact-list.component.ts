import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { userkit } from 'lib/qchat/userkit';
import { UserKit } from 'lib/qchat/userkit/UserKit';

@Component({
	selector: 'app-contact-list',
	templateUrl: './contact-list.component.html',
	styleUrls: ['./contact-list.component.scss']
})

export class ContactListComponent implements OnInit {
	@Output()
	sigStartMessenger = new EventEmitter<any>();

	users: { [key: string]: any }[] = [];
	selecteduserid = null;

	private _usermap: { [key: string]: number } = {};

	constructor(private _cdr: ChangeDetectorRef) {
		UserKit.onuserin = user_id => { this.addUser(user_id); };
		UserKit.onuserout = user_id => { this.removeUser(user_id); };
		userkit.init();
	}

	ngOnInit(): void {
		userkit.getUsers().forEach(user_id => { this.addUser(user_id); });
	}

	private addUser(user_id: string): void {
		this._usermap[user_id] = this.users.length;
		this.users.push({
			id: user_id,
			username: user_id,
			profile_picture: null,
			message: '>|<'
		});
		this._cdr.detectChanges();
	}

	private removeUser(user_id: string): void {
		var i = this._usermap[user_id];
		delete this._usermap[user_id];

		this.users.splice(i, 1);
		this._cdr.detectChanges();
	}
}
