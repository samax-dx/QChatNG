import { Component, ComponentFactoryResolver, ComponentFactory, ViewContainerRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ConversationComponent } from '../conversation/conversation.component';


@Component({
	selector: 'app-messanger',
	templateUrl: './messanger.component.html',
	styleUrls: ['./messanger.component.scss']
})
export class MessangerComponent {
	@ViewChild("conversation_container_default", { read: ViewContainerRef }) private _defaultConversationContainer;
	@ViewChild("conversation_container_callmode", { read: ViewContainerRef }) private _callmodeConversationContainer;
	private _conversationcf: ComponentFactory<ConversationComponent>;

	//private _defaultConversationContainer: ViewContainerRef | null = null;
	//private _callmodeConversationContainer: ViewContainerRef | null = null;

	private _components: { [key: string]: ConversationComponent } = {};
	private _components_callmode: { [key: string]: ConversationComponent } = {};

	private _mode: 'default' | 'call' = 'default';
	private _callmode_sidebar: 'none' | 'contact' | 'conversation' = 'none';

	private _selectedUser = null;

	constructor(
		private _cdr: ChangeDetectorRef, cfr: ComponentFactoryResolver
	) {
		this._conversationcf = cfr.resolveComponentFactory(
			ConversationComponent
		);
	}

	//setDefaultConversationContainerRef(ref: ViewContainerRef): void {
	//	this._defaultConversationContainer = ref;
	//}
	//setCallModeConversationContainerRef(ref: ViewContainerRef): void {
	//	this._callmodeConversationContainer = ref;
	//}

	public onOpenConversation(user: any) {
		this._selectedUser = user;

		if (this._mode === "call")
			Object.assign(this, { _callmode_sidebar: "conversation" });

		var setupConversationWidget = (
			components: { [key: string]: ConversationComponent },
			getViewContainerRef: () => ViewContainerRef
		) => {
			var containerref: ViewContainerRef = getViewContainerRef();

			Object.getOwnPropertyNames(components).forEach(id => {
				Object.assign(components[id], { conversationDisplay: "none" });
			});

			var component = components[user.id];
			if (component) {
				Object.assign(component, { conversationDisplay: "unset" });
				return;
			}

			component = containerref.createComponent(
				this._conversationcf
			).instance;

			// component.updateUser(user);
			component.setUser(user);
			component.setChatTypeSwitcher(
				(user: any) => { this.startCall(user); }
			);

			components[user.id] = component;
		};

		// setTimeout(() => {
			if (this._mode === "default") {
				setupConversationWidget(
					this._components,
					() => { return this._defaultConversationContainer; }
				);
			} else if (this._mode === "call") {
				setupConversationWidget(
					this._components_callmode,
					() => { return this._callmodeConversationContainer; }
				);
			} else return console.warn("invalid chat mode");
		// }, 100);
	}

	public startCall(user) {
		this._mode = "call";
	}
}
