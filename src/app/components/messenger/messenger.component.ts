import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ComponentFactory,
    ComponentFactoryResolver
} from '@angular/core';

import { IMWidgetComponent } from '../imwidget/imwidget.component';
import { CallWidgetComponent } from '../call-widget/call-widget.component';


@Component({
    selector: 'app-messenger',
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {
    @ViewChild("imwidget_container", { read: ViewContainerRef })
    imwidgetVCR: ViewContainerRef;
    private _imwidgetCF: ComponentFactory<IMWidgetComponent>;
    private _imwidget: IMWidgetComponent;

    @ViewChild("callwidget_container", { read: ViewContainerRef })
    callwidgetVCR: ViewContainerRef;
    private _callwidgetCF: ComponentFactory<CallWidgetComponent>;
    private _callwidget: CallWidgetComponent | null = null;

    user: any;

    imwmode: "full" | "lite" | "none" = "full";
    callwmode: "full" | "lite" | "none" = "none";
    sidebar_on: boolean = false;

    active: boolean = true;

    private _initok = false;
    private _showSidebar: (name?: string) => void = () => { };


    constructor(cfr: ComponentFactoryResolver) {
        this._imwidgetCF = cfr.resolveComponentFactory(IMWidgetComponent);
        this._callwidgetCF = cfr.resolveComponentFactory(CallWidgetComponent);

        this._imwidget = <any>null;
    }

    ngOnInit() {
        this._initok = true;
        this.tryInit();
    }

    showInCallSidebar(sidebar: string): void { // call only from template
        if (!this._callwidget) return;

        this.imwmode = "none";
        this.callwmode = "full";
        this._showSidebar(sidebar);
    }

    toggleIMWidget(): void { // call only from template
        if (this.imwmode === "full") return;

        this._showSidebar("none"); // no sidebar

        if (this.imwmode === "lite") {
            this.imwmode = "none";
            this.callwmode = "full";
        } else {
            this.imwmode = "lite";
            this.callwmode = "lite";
        }
    }


    setUser(user: any): void { this.user = user; }

    setSidebarViewer(
        sbv: (name?: "none" | "contacts" | "groups") => void
    ): void {
        this._showSidebar = (name?: "none" | "contacts" | "groups") => {
            this.sidebar_on = name && name !== "none";
            sbv(name);
        };
    }

    init(): void { this.tryInit(); }

    onmessage(message: any): void { this._imwidget.updateMessages(message); }

    oncall(videorequested: boolean): void {
        this.openCallW("inbound", videorequested);
        this.setupCallUi();
    }

    show(): void {
        this.active = true;
        if (this._callwidget) this.setupCallUi();
    }

    hide(): void { this.active = false; }


    private tryInit(): void {
        var user = this.user;
        if (!(user && this._initok)) return;

        this.openIMW();
    }

    private openIMW() {
        var imwidget = this._imwidget = (
            this.imwidgetVCR.createComponent(this._imwidgetCF).instance
        );

        imwidget.user = this.user;
        imwidget.outboundcallstarter = type => {
            this.setupCallUi();
            this.openCallW("outbound", type === 'video');
        };
    }

    private openCallW(
        calltype: "inbound" | "outbound", enablelocalvideo: boolean
    ): void {
        var callwidget = this._callwidget = (
            this.callwidgetVCR.createComponent(this._callwidgetCF).instance
        );

        callwidget.user = this.user;
        callwidget.oncallended = () => {
            this.clearCallUi();

            this._callwidget = null;
            this.callwidgetVCR.remove();
        };
        callwidget.calltype = calltype;
        callwidget.enablelocalvide = enablelocalvideo;
    }

    private setupCallUi(): void {
        this._showSidebar("none");
        this.imwmode = "none";
        this.callwmode = "full";
        this._imwidget.disableCallbar();
    }

    private clearCallUi(): void {
        this.callwmode = "none";
        this.imwmode = "full";
        this._showSidebar(); // last sidebar
        this._imwidget.enableCallbar();
    }
}
