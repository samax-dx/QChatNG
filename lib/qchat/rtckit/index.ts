import { signalx, XConnectEvent } from '../signalx';
import { RTCKit } from './RTCKit';
import { QPeer } from './qpeer/QPeer';


export const rtckit = new class implements RTCKit {
    private _init_ok = false;

    init() {
        if (this._init_ok) return;
        this._init_ok = true;

        QPeer.onpeermessage = RTCKit.onpeermessage;
        QPeer.sendmessagealt = RTCKit.sendmessagealt;

        signalx.onconnectevent = event => {
            var data = event.data;
            var ruser = event.ruser;

            var peer = RTCKit.peers().get(ruser);
            if (event.type === "offer")
                if (!peer) peer = RTCKit.peers().createpeer(ruser);

            if (!peer) return console.error("QPeer not found");

            switch (event.type) {
                case "offer":
                    peer.takeOffer(
                        data
                    ).then(() => {
                        return peer.doAnswer("answer");
                    }).then(() => {
                        //
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                case "answer":
                    peer.setAnswer(
                        data
                    ).then(() => {
                        //
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                case "candidate":
                    peer.addIce(
                        new RTCIceCandidate(data)
                    ).then(() => {
                        //
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                default:
                    break;
            }
        };
    }
}();
