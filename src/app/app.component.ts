import { Component } from '@angular/core';
import { signalx } from 'lib/qchat/signalx';
import { UserKit } from 'lib/qchat/userkit/UserKit';
import { userkit } from 'lib/qchat/userkit';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'qchat-client';

    constructor() {
        var clientid = (new URL(window.location.href)).searchParams.get("id");

        if (!clientid || clientid.trim().length === 0) return;
        else UserKit.localuser = clientid = clientid.trim();

        var serverurl = "wss://bu-connect.qmixin.com:8083";//"ws://qmixin.com:8083/";
        signalx.socket = new WebSocket(serverurl + "/" + clientid);

        signalx.init();
        userkit.init();
    }
}
