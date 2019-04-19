import { IMKit } from './IMKit';
import { SessionOB } from '../rtckit/Session';
import { RTCKit } from '../rtckit/RTCKit';
import { rtckit } from '../rtckit';
import { signalx } from '../signalx';


export const imkit = new class implements IMKit {
    private _init_ok = false;

    init() {
        if (this._init_ok) return;
        this._init_ok = true;

        RTCKit.onpeermessage = IMKit.onmessage;
        RTCKit.sendmessagealt = (user: string, msg: object): void => {
            signalx.send("message", msg, user);
        };
        rtckit.init();

        signalx.ondataevent = event => {
            if (event.type === "message") {
                IMKit.onmessage(event.ruser, event.data);
            }
        };
    }

    sendmessage(user: string, msg: object): void {
        var peer = RTCKit.peers().get(user);
        if (!peer) {
            peer = RTCKit.peers().createpeer(user);
            peer.makeOffer(
                "offer"
            ).then(() => {
                peer.sendMessage(msg)
            }).catch(err => {
                console.error(err);
            });
        } else peer.sendMessage(msg);
    }
}();
