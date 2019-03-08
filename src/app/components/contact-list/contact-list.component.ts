import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-contact-list',
	templateUrl: './contact-list.component.html',
	styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
	@Output() private sigOpenConversation = new EventEmitter<any>();

	private _chatListUsers = [];
	private _selectedUserId = null;

	constructor() { }

	ngOnInit() {
		this._chatListUsers = [
			{
				id: "samax.w1",
				username: "samax.w1",
				profile_picture: null,
				message: '>|<'
			},
			{
				id: "samax.w2",
				username: "samax.w2",
				profile_picture: null,
				message: '>|<'
			},
			{
				id: "samax.w3",
				username: "samax.w3",
				profile_picture: null,
				message: '>|<'
			},
			{
				id: "samax.w4",
				username: "samax.w4",
				profile_picture: null,
				message: '>|<'
			},
		];
	}
	isUserSelected(userId: number): boolean {
		return this._selectedUserId === userId;
	}
}
